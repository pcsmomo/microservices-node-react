# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 6 - (Optional) Leveraging a Cloud Environment for Development

### 121. Remote Dev with Skaffold

- Scenario #1 - We changed a 'Synced' File
  - update corresponding file in appropriate pod
- Scenario #2 - We changed a 'Unsynced' File such as `package.json`
  - Rebuild image -> Google Cloud Build
  - Google Cloud Build -> Update deployment -> Google Cloud VM

### 123. Google Cloud Initial Setup

- Use a new Google account to get tree tier with $300 credit
- Go to Google Cloud and create a new project `ticketing-dev`
- When the project is created, select it

### 124. Kubernetes Cluster Creation

- Kubernetes Engine -> Enable (takes a few minutes)
- Kubernetes clusters -> Create -> Create it myself (not using auto pilot)
- Cluster basic
  - name: `ticketing-dev`
  - Location type
    - Zonal
      - Zone: `australia-southeast1-a`
        - Estimated monthly cost $217.61
        - That's about $0.30 per hour
  - Control plane version
    - Release version
      - 1.24.8-gke.2000 (default)
    - (in lecture) Static version
      - choose at least higher than v1.15
- Node Pools -> default-pool
  - size: 3
- Node Pools -> Nodes
  - Series: E2 (in the lecture, N1)
  - Machine type: e2-small (in the lecture, g1-small)
    - The estimated cost will changes
    - micro is not recommended
- Create
  - it will take a few minutes

### 125. Kubectl Contexts

#### Set up kubectl context to connect google cloud

- way 1. Google cloud dashboard
- \*way 2. Google cloud sdk

- [Google Cloud SDK Docs](https://cloud.google.com/sdk/docs/install-sdk)
- To check your current Python version, run python3 -V or python -V. Supported versions are Python 3 (3.5 to 3.9).
- Download the sdk install file

```sh
pyenv global 3.9.15
python version
# Python 3.9.15
uname -m
# arm64
```

```sh
./google-cloud-sdk/install.sh
# Welcome to the Google Cloud CLI!

# To help improve the quality of this product, we collect anonymized usage data
# and anonymized stacktraces when crashes are encountered; additional information
# is available at <https://cloud.google.com/sdk/usage-statistics>. This data is
# handled in accordance with our privacy policy
# <https://cloud.google.com/terms/cloud-privacy-notice>. You may choose to opt in this
# collection now (by choosing 'Y' at the below prompt), or at any time in the
# future by running the following command:

#     gcloud config set disable_usage_reporting false

# Do you want to help improve the Google Cloud CLI (y/N)?  y


# Your current Google Cloud CLI version is: 417.0.1
# The latest available version is: 417.0.1

# ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
# │                                                 Components                                                 │
# ├───────────────┬──────────────────────────────────────────────────────┬──────────────────────────┬──────────┤
# │     Status    │                         Name                         │            ID            │   Size   │
# ├───────────────┼──────────────────────────────────────────────────────┼──────────────────────────┼──────────┤
# │ Not Installed │ App Engine Go Extensions                             │ app-engine-go            │  4.0 MiB │
# │ Not Installed │ Appctl                                               │ appctl                   │ 18.5 MiB │
# │ Not Installed │ Artifact Registry Go Module Package Helper           │ package-go-module        │  < 1 MiB │
# │ Not Installed │ Cloud Bigtable Command Line Tool                     │ cbt                      │  9.8 MiB │
# │ Not Installed │ Cloud Bigtable Emulator                              │ bigtable                 │  6.3 MiB │
# │ Not Installed │ Cloud Datastore Emulator                             │ cloud-datastore-emulator │ 35.1 MiB │
# │ Not Installed │ Cloud Firestore Emulator                             │ cloud-firestore-emulator │ 40.2 MiB │
# │ Not Installed │ Cloud Pub/Sub Emulator                               │ pubsub-emulator          │ 62.5 MiB │
# │ Not Installed │ Cloud Run Proxy                                      │ cloud-run-proxy          │  7.4 MiB │
# │ Not Installed │ Cloud SQL Proxy                                      │ cloud_sql_proxy          │  7.3 MiB │
# │ Not Installed │ Google Container Registry's Docker credential helper │ docker-credential-gcr    │          │
# │ Not Installed │ Kustomize                                            │ kustomize                │  7.4 MiB │
# │ Not Installed │ Log Streaming                                        │ log-streaming            │ 11.9 MiB │
# │ Not Installed │ Minikube                                             │ minikube                 │ 31.3 MiB │
# │ Not Installed │ Nomos CLI                                            │ nomos                    │ 24.6 MiB │
# │ Not Installed │ On-Demand Scanning API extraction helper             │ local-extract            │ 11.9 MiB │
# │ Not Installed │ Skaffold                                             │ skaffold                 │ 20.0 MiB │
# │ Not Installed │ Terraform Tools                                      │ terraform-tools          │ 59.6 MiB │
# │ Not Installed │ anthos-auth                                          │ anthos-auth              │ 19.2 MiB │
# │ Not Installed │ config-connector                                     │ config-connector         │ 55.6 MiB │
# │ Not Installed │ gcloud Alpha Commands                                │ alpha                    │  < 1 MiB │
# │ Not Installed │ gcloud Beta Commands                                 │ beta                     │  < 1 MiB │
# │ Not Installed │ gcloud app Java Extensions                           │ app-engine-java          │ 63.9 MiB │
# │ Not Installed │ gcloud app PHP Extensions                            │ app-engine-php           │ 21.9 MiB │
# │ Not Installed │ gcloud app Python Extensions                         │ app-engine-python        │  8.6 MiB │
# │ Not Installed │ gcloud app Python Extensions (Extra Libraries)       │ app-engine-python-extras │ 26.4 MiB │
# │ Not Installed │ gke-gcloud-auth-plugin                               │ gke-gcloud-auth-plugin   │  7.1 MiB │
# │ Not Installed │ kpt                                                  │ kpt                      │ 20.4 MiB │
# │ Not Installed │ kubectl                                              │ kubectl                  │  < 1 MiB │
# │ Not Installed │ kubectl-oidc                                         │ kubectl-oidc             │ 19.2 MiB │
# │ Not Installed │ pkg                                                  │ pkg                      │          │
# │ Installed     │ BigQuery Command Line Tool                           │ bq                       │  1.6 MiB │
# │ Installed     │ Cloud Storage Command Line Tool                      │ gsutil                   │ 15.6 MiB │
# │ Installed     │ Google Cloud CLI Core Libraries                      │ core                     │ 26.4 MiB │
# │ Installed     │ Google Cloud CRC32C Hash Tool                        │ gcloud-crc32c            │  1.1 MiB │
# └───────────────┴──────────────────────────────────────────────────────┴──────────────────────────┴──────────┘
# To install or remove components at your current SDK version [417.0.1], run:
#   $ gcloud components install COMPONENT_ID
#   $ gcloud components remove COMPONENT_ID

# To update your SDK installation to the latest version [417.0.1], run:
#   $ gcloud components update


# Modify profile to update your $PATH and enable shell command completion?

# Do you want to continue (Y/n)?  Y

# The Google Cloud SDK installer will now prompt you to update an rc file to bring the Google Cloud CLIs into your environment.

# Enter a path to an rc file to update, or leave blank to use [/Users/noah/.zshrc]:
# Backing up [/Users/noah/.zshrc] to [/Users/noah/.zshrc.backup].
# [/Users/noah/.zshrc] has been updated.

# ==> Start a new shell for the changes to take effect.


# For more information on how to get started, please visit:
#   https://cloud.google.com/sdk/docs/quickstarts
```

```zsh
# Paths has been added by install.sh
# ~/.zshrc
# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/noah/Documents/study/study_codes/udemy/microservices-node-react/resources/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/noah/Documents/study/study_codes/udemy/microservices-node-react/resources/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/noah/Documents/study/study_codes/udemy/microservices-node-react/resources/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/noah/Documents/study/study_codes/udemy/microservices-node-react/resources/google-cloud-sdk/completion.zsh.inc'; fi
```

</details>
