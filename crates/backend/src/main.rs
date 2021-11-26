// Copyright 2018-2021 Parity Technologies (UK) Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

mod cli;
mod services;

use crate::{
    cli::Opts,
    services::{
        compile::{route_compile, COMPILE_SANDBOXED},
        frontend::route_frontend,
        gist::{create::route_gist_create, load::route_gist_load},
    },
};
use actix_cors::Cors;
use actix_web::{
    middleware::{Condition, DefaultHeaders},
    web::{get, post},
    App, HttpResponse, HttpServer,
};
use clap::Clap;
use std::path::Path;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();

    // Cloned because they're needed after closure
    let port = opts.port.clone();
    let host = opts.host.clone();

    if let Some(path) = &opts.frontend_folder {
        if !Path::new(path).is_dir() {
            panic!("{} is not a valid directory.", path);
        }
    }

    HttpServer::new(move || {
        let opts: Opts = opts.clone();
        // Cloned because they're needed after closure
        let frontend_folder = opts.frontend_folder.clone();

        let mut app = App::new()
            .wrap(Condition::new(opts.dev_mode, Cors::permissive()))
            .wrap(
                DefaultHeaders::new()
                    .header("Cross-Origin-Opener-Policy", "same-origin")
                    .header("Cross-Origin-Embedder-Policy", "require-corp"),
            )
            .route(
                "/compile",
                post().to(|body| route_compile(COMPILE_SANDBOXED, body)),
            )
            .route(
                "/status",
                get().to(|| HttpResponse::Ok().body("ink-backend is live")),
            );

        if let Some(github_token) = opts.github_token {
            let github_token_a = github_token.clone();
            let github_token_b = github_token.clone();
            app = app
                .route(
                    "gist/create",
                    post()
                        .to(move |body| route_gist_create(github_token_a.clone(), body)),
                )
                .route(
                    "gist/load",
                    post().to(move |body| route_gist_load(github_token_b.clone(), body)),
                );
        }

        if let Some(path) = frontend_folder {
            app = app.service(route_frontend("/", path.as_ref()));
        }

        app
    })
    .bind(format!("{}:{}", &host, &port))?
    .run()
    .await?;

    Ok(())
}
