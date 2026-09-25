#!/usr/bin/env bash
#
# Upload repository to GitHub using GitHub CLI (gh) with authentication & remote setup.
#

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────
# Styling & Helpers
# ──────────────────────────────────────────────────────────────────────────

if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
  BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0)
  BLUE=$(tput setaf 4); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3); RED=$(tput setaf 1); CYAN=$(tput setaf 6)
else
  BOLD=""; DIM=""; RESET=""; BLUE=""; GREEN=""; YELLOW=""; RED=""; CYAN=""
fi

info()    { printf "%s[INFO]%s  %s\n" "$BLUE" "$RESET" "$1"; }
success() { printf "%s[OK]%s    %s\n" "$GREEN" "$RESET" "$1"; }
warn()    { printf "%s[WARN]%s  %s\n" "$YELLOW" "$RESET" "$1"; }
error()   { printf "%s[ERROR]%s %s\n" "$RED" "$RESET" "$1" >&2; }
step()    { printf "\n%s%s▸ %s%s\n" "$BOLD" "$CYAN" "$1" "$RESET"; }

prompt_input() {
  local var_name="$1"
  local prompt_label="$2"
  local default_value="${3:-}"
  local input=""

  if [[ -n "$default_value" ]]; then
    printf "  %s [%s%s%s]: " "$prompt_label" "$DIM" "$default_value" "$RESET"
  else
    printf "  %s: " "$prompt_label"
  fi

  if [[ -r /dev/tty ]]; then
    read -r input </dev/tty || input=""
  else
    read -r input || input=""
  fi

  input="${input#"${input%%[![:space:]]*}"}" # trim leading
  input="${input%"${input##*[![:space:]]}"}" # trim trailing

  if [[ -z "$input" && -n "$default_value" ]]; then
    eval "$var_name=\"$default_value\""
  else
    eval "$var_name=\"$input\""
  fi
}

# ──────────────────────────────────────────────────────────────────────────
# Step 1: Verify Git Repository
# ──────────────────────────────────────────────────────────────────────────

step "Verifying Git repository"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  error "Current directory is not a Git repository. Run 'git init' first."
  exit 1
fi

REPO_DIR="$(git rev-parse --show-toplevel)"
cd "$REPO_DIR"

CURRENT_BRANCH="$(git branch --show-current || echo "")"
if [[ -z "$CURRENT_BRANCH" ]]; then
  info "No branch checked out or repository has no commits yet."
  CURRENT_BRANCH="main"
  git checkout -B "$CURRENT_BRANCH" 2>/dev/null || true
fi

success "Git repository located at: $REPO_DIR (branch: $CURRENT_BRANCH)"

# ──────────────────────────────────────────────────────────────────────────
# Step 2: Check & Install GitHub CLI (gh)
# ──────────────────────────────────────────────────────────────────────────

step "Checking GitHub CLI (gh)"

export PATH="$HOME/.local/bin:$PATH"

if ! command -v gh >/dev/null 2>&1; then
  warn "GitHub CLI ('gh') is not installed."
  prompt_input INSTALL_NOW "Install GitHub CLI into ~/.local/bin (no sudo required)? (y/n)" "y"
  if [[ "$INSTALL_NOW" =~ ^[Yy]$ ]]; then
    info "Downloading and installing GitHub CLI to ~/.local/bin..."
    mkdir -p "$HOME/.local/bin"
    ARCH="$(uname -m)"
    case "$ARCH" in
      x86_64) GH_ARCH="linux_amd64" ;;
      aarch64|arm64) GH_ARCH="linux_arm64" ;;
      *) GH_ARCH="linux_386" ;;
    esac
    TMP_DIR=$(mktemp -d)
    curl -fsSL "https://github.com/cli/cli/releases/download/v2.101.0/gh_2.101.0_${GH_ARCH}.tar.gz" | tar -xz -C "$TMP_DIR"
    cp "$TMP_DIR"/gh_*/bin/gh "$HOME/.local/bin/"
    chmod +x "$HOME/.local/bin/gh"
    rm -rf "$TMP_DIR"
  else
    error "GitHub CLI ('gh') is required to continue."
    exit 1
  fi
fi

if ! command -v gh >/dev/null 2>&1; then
  error "GitHub CLI was installed but not found in PATH. Please ensure ~/.local/bin is in your PATH."
  exit 1
fi

success "GitHub CLI is installed: $(gh --version | head -n 1)"

# ──────────────────────────────────────────────────────────────────────────
# Step 3: Remote GitHub CLI Authentication
# ──────────────────────────────────────────────────────────────────────────

step "Checking GitHub authentication"

AUTH_OK=false
if gh auth status >/dev/null 2>&1; then
  AUTH_OK=true
fi

if [[ "$AUTH_OK" == "true" ]]; then
  LOGGED_USER=$(gh api user --jq '.login' 2>/dev/null || echo "authenticated user")
  success "Logged into GitHub as: $LOGGED_USER"
else
  warn "Not logged into GitHub CLI."
  echo ""
  echo "  Starting GitHub CLI login..."
  echo "  - If you are on a remote server/SSH or headless session, you can use the"
  echo "    one-time device activation code shown in your terminal at https://github.com/login/device."
  echo "  - You can also choose between Web Browser login or Personal Access Token (PAT)."
  echo ""

  if [[ -r /dev/tty ]]; then
    gh auth login </dev/tty >/dev/tty 2>&1 || gh auth login
  else
    gh auth login
  fi

  if ! gh auth status >/dev/null 2>&1; then
    error "Authentication failed. Please verify your credentials and try again."
    exit 1
  fi

  LOGGED_USER=$(gh api user --jq '.login' 2>/dev/null || echo "authenticated user")
  success "Authentication successful! Logged in as: $LOGGED_USER"
fi

# ──────────────────────────────────────────────────────────────────────────
# Step 4: Ensure Git Commits Exist
# ──────────────────────────────────────────────────────────────────────────

step "Checking commit history"

if ! git rev-parse HEAD >/dev/null 2>&1; then
  warn "Repository has no commits yet. Creating initial commit..."
  git add -A
  git commit -m "Initial commit"
  success "Initial commit created."
else
  UNCOMMITTED=$(git status --porcelain)
  if [[ -n "$UNCOMMITTED" ]]; then
    warn "You have uncommitted changes in the repository:"
    git status --short
    echo ""
    prompt_input COMMIT_NOW "Would you like to commit all changes before uploading? (y/n)" "y"
    if [[ "$COMMIT_NOW" =~ ^[Yy]$ ]]; then
      prompt_input COMMIT_MSG "Commit message" "feat: prepare repository for GitHub upload"
      git add -A
      git commit -m "$COMMIT_MSG"
      success "Committed working changes."
    fi
  else
    success "Working tree is clean."
  fi
fi

# ──────────────────────────────────────────────────────────────────────────
# Step 5: Remote Origin & GitHub Repository Setup
# ──────────────────────────────────────────────────────────────────────────

step "Configuring GitHub remote repository"

DEFAULT_REPO_NAME="$(basename "$REPO_DIR")"
HAS_REMOTE=false

if git remote get-url origin >/dev/null 2>&1; then
  HAS_REMOTE=true
  EXISTING_URL="$(git remote get-url origin)"
  info "Remote 'origin' is already configured: $EXISTING_URL"
  prompt_input PUSH_EXISTING "Push current branch '$CURRENT_BRANCH' to this existing remote? (y/n)" "y"
  if [[ ! "$PUSH_EXISTING" =~ ^[Yy]$ ]]; then
    prompt_input RESET_REMOTE "Do you want to re-create or link a different remote? (y/n)" "n"
    if [[ "$RESET_REMOTE" =~ ^[Yy]$ ]]; then
      git remote remove origin
      HAS_REMOTE=false
    else
      info "Aborting upload. Remote was left unchanged."
      exit 0
    fi
  fi
fi

if [[ "$HAS_REMOTE" == "false" ]]; then
  echo ""
  prompt_input REPO_NAME "Repository name on GitHub" "$DEFAULT_REPO_NAME"

  echo ""
  echo "  Repository visibility:"
  echo "    1) private (Default - only you and invited collaborators)"
  echo "    2) public  (Visible to everyone)"
  prompt_input VISIBILITY_CHOICE "Select visibility (1 or 2)" "1"

  if [[ "$VISIBILITY_CHOICE" == "2" || "$VISIBILITY_CHOICE" == "public" ]]; then
    VISIBILITY_FLAG="--public"
  else
    VISIBILITY_FLAG="--private"
  fi

  prompt_input REPO_DESC "Repository description (optional)" "Bronze e-commerce storefront and API"

  info "Creating GitHub repository '$REPO_NAME' ($VISIBILITY_FLAG)..."
  gh repo create "$REPO_NAME" \
    "$VISIBILITY_FLAG" \
    --source=. \
    --remote=origin \
    --description "$REPO_DESC" \
    --push

  success "GitHub repository created and initial push completed!"
fi

# ──────────────────────────────────────────────────────────────────────────
# Step 6: Push Latest Changes & Set Upstream
# ──────────────────────────────────────────────────────────────────────────

step "Ensuring upstream branch is set and up to date"

info "Pushing branch '$CURRENT_BRANCH' to origin..."
git push -u origin "$CURRENT_BRANCH"

success "Branch '$CURRENT_BRANCH' successfully pushed to GitHub!"

# ──────────────────────────────────────────────────────────────────────────
# Step 7: Summary & View Link
# ──────────────────────────────────────────────────────────────────────────

step "Summary"

REMOTE_URL="$(git remote get-url origin || echo "")"
success "Remote URL: $REMOTE_URL"

if command -v gh >/dev/null 2>&1; then
  REPO_WEB_URL=$(gh repo view --json url --jq '.url' 2>/dev/null || echo "$REMOTE_URL")
  echo ""
  printf "  %sRepository is live at:%s %s%s%s\n\n" "$BOLD" "$RESET" "$GREEN" "$REPO_WEB_URL" "$RESET"

  prompt_input OPEN_BROWSER "Open repository in browser now? (y/n)" "n"
  if [[ "$OPEN_BROWSER" =~ ^[Yy]$ ]]; then
    gh repo view --web || true
  fi
fi

echo ""
success "Done!"
