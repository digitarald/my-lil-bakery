ARG VARIANT=22-bookworm-slim
FROM node:${VARIANT}

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for pnpm
RUN corepack enable

# Set the working directory
WORKDIR /workspace

# Create node user directory and set permissions
RUN mkdir -p /home/node/.local/share/pnpm \
    && chown -R node:node /home/node/.local

# Switch to node user
USER node

# Set environment variables for pnpm
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm globally for the node user
RUN corepack prepare pnpm@latest --activate

# Verify pnpm installation
RUN pnpm --version

# Set the default command
CMD ["sleep", "infinity"]
