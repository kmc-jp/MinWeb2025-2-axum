# Builder Stage
FROM rust:1-slim as builder

WORKDIR /usr/src/app
COPY . .

# ビルドキャッシュをマウントする場合
# RUN --mount=type=cache,target=/usr/local/cargo/registry \\
#     --mount=type=cache,target=target \\
#     cargo build --release

# ビルドキャッシュを利用しない場合
RUN cargo install --path .

# Final Stage
FROM debian:bookworm-slim

# /usr/local/bin にビルドされたバイナリをコピー
COPY --from=builder /usr/local/cargo/bin/backend /usr/local/bin/backend

# ポート3001番を公開
EXPOSE 3000
# コンテナ起動時にbackendを実行
CMD ["backend"]