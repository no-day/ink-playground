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

use clap::Clap;

const DEFAULT_PATH: &str = "./Cargo.toml";
const DEFAULT_OUTPUT: &str = "./change.json";

#[derive(Clap)]
#[clap(
    version = "0.1",
    author = "Achim Schneider <achim@parity.io>",
    about = "Extract Crate Data to JSON for rust analyzer"
)]
pub struct Opts {
    #[clap(subcommand)]
    pub subcmd: SubCommand,
}

#[derive(Clap)]
pub enum SubCommand {
    #[clap(about = "Create .json file for Rust Crate")]
    CmdCreate(CmdCreate),
}

#[derive(Clap)]
pub struct CmdCreate {
    #[clap(short = 'i', long = "input", default_value = DEFAULT_PATH)]
    pub path: String,
    #[clap(short = 'o', long = "output", default_value = DEFAULT_OUTPUT )]
    pub output: String,
}
