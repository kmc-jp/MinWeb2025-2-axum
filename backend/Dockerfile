# Builder Stage
FROM rust:1-slim as builder

WORKDIR /usr/src/app
COPY . .

# Build the application
RUN cargo build --release

# Final Stage
FROM debian:bookworm-slim

# Copy the built binary from the builder stage to a directory in the PATH
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/backend

# Expose port 3000
EXPOSE 3000

# Set the entrypoint to run the application
ENTRYPOINT ["/usr/local/bin/backend"]