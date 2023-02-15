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

### 126. Initializing the GCloud SDK

```sh
gcloud --version
# Google Cloud SDK 417.0.1
# bq 2.0.84
# core 2023.02.08
# gcloud-crc32c 1.0.0
# gsutil 5.19

gcloud auth login
# Choose the google account I use for this project
# You are now logged in as [d****].
# Your current project is [None].  You can change this setting by running:
#   $ gcloud config set project PROJECT_ID
# https://cloud.google.com/sdk/auth_success?authuser=2

gcloud init
# Pick configuration to use:
#  [1] Re-initialize this configuration [default] with new settings
# Pick cloud project to use:
#  [2] ticketing-dev-377721
# Which Google Compute Engine zone would you like to use as project default?
# If you do not specify a zone via a command line flag while working with Compute Engine resources, the default is assumed.
#  [40] australia-southeast1-a

# Your project default Compute Engine zone has been set to [australia-southeast1-a].
# You can change it by running [gcloud config set compute/zone NAME].

# Your project default Compute Engine region has been set to [australia-southeast1].
# You can change it by running [gcloud config set compute/region NAME].

# Created a default .boto configuration file at [/Users/noah/.boto]. See this file and
# [https://cloud.google.com/storage/docs/gsutil/commands/config] for more
# information about configuring Google Cloud Storage.
# Your Google Cloud SDK is configured and ready to use!

# * Commands that require authentication will use d**** by default
# * Commands will reference project `ticketing-dev-377721` bylt
# * Compute Engine commands will use region `australia-southeast defau1` by default
# * Compute Engine commands will use zone `australia-southeast1-a` by default

# Run `gcloud help config` to learn how to change individual settings

# This gcloud configuration is called [default]. You can create additional configurations if you work with multiple accounts and/or projects.
# Run `gcloud topic configurations` to learn more.

# Some things to try next:

# * Run `gcloud --help` to see the Cloud Platform services you can interact with. And run `gcloud help COMMAND` to get help on any gcloud command.
# * Run `gcloud topic --help` to learn about advanced features of the SDK like arg files and output formatting
# * Run `gcloud cheat-sheet` to see a roster of go-to `gcloud` commands.
```

### 127. Installing the GCloud Context

- Option 1. Don't want to run Docker at all
  - Close Docker Desktop
  - Run `gcloud components install kubectl`
  - Run `gcloud container clusters get-credentials <cluster name>`
- \*Option 2. Ok still running Docker on local
  - Run `gcloud container clusters get-credentials <cluster name>`

```sh
gcloud container clusters get-credentials ticketing-dev
# Fetching cluster endpoint and auth data.
# CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
# kubeconfig entry generated for ticketing-dev.

gcloud components install gke-gcloud-auth-plugin
# Your current Google Cloud CLI version is: 417.0.1
# Installing components from version: 417.0.1

# ┌────────────────────────────────────────────┐
# │    These components will be installed.     │
# ├────────────────────────┬─────────┬─────────┤
# │          Name          │ Version │   Size  │
# ├────────────────────────┼─────────┼─────────┤
# │ gke-gcloud-auth-plugin │   0.4.0 │ 7.1 MiB │
# └────────────────────────┴─────────┴─────────┘

# For the latest full release notes, please visit:
#   https://cloud.google.com/sdk/release_notes

# Do you want to continue (Y/n)?  y

# ╔════════════════════════════════════════════════════════════╗
# ╠═ Creating update staging area                             ═╣
# ╠════════════════════════════════════════════════════════════╣
# ╠═ Installing: gke-gcloud-auth-plugin                       ═╣
# ╠════════════════════════════════════════════════════════════╣
# ╠═ Installing: gke-gcloud-auth-plugin                       ═╣
# ╠════════════════════════════════════════════════════════════╣
# ╠═ Creating backup and activating new installation          ═╣
# ╚════════════════════════════════════════════════════════════╝

# Performing post processing steps...done.

# Update done!

gcloud container clusters get-credentials ticketing-dev
# Fetching cluster endpoint and auth data.
# kubeconfig entry generated for ticketing-dev.

kubectx
# gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev
# minikube
# specnetes

# Choose my local minikube
kubectx minikube
# Switched to context "minikube".
k get pods
# NAME                         READY   STATUS    RESTARTS   AGE
# auth-depl-668ff4bfdb-fmtgd   1/1     Running   0          157m

# Choose google cloud kubernetes cluster
kubectx gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev
# Switched to context "gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev".
k get pods
# No resources found in default namespace.
```

### 128. Updating the Skaffold Config

1. Enable Google Cloud Build
   - Google Cloud -> CI/CD -> Cloud Build API -> Enable
2. Update the `skaffold.yaml` file to use Google Cloud Build
3. Setup ingress-nginx on our google cloud cluster kubernetes.github.io/ingress-nginx
4. Update our hosts file again to poin to the remote cluster
5. Restart skaffold

### 130. Creating a Load Balancer

[ingress-nginx deploy to Google Cloud GKE](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)

```sh
# Check the kubectl context
kubectx
# gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev

kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user $(gcloud config get-value account)
# clusterrolebinding.rbac.authorization.k8s.io/cluster-admin-binding created

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.3/deploy/static/provider/cloud/deploy.yaml
# error: unable to read URL "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.3/deploy/static/provider/cloud/deploy.yaml", server reported 404 Not Found, status code=404
```

Navigate https://github.com/kubernetes/ingress-nginx/tree/main/deploy/static/provider/cloud

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/cloud/deploy.yaml
# namespace/ingress-nginx created
# serviceaccount/ingress-nginx created
# serviceaccount/ingress-nginx-admission created
# role.rbac.authorization.k8s.io/ingress-nginx created
# role.rbac.authorization.k8s.io/ingress-nginx-admission created
# clusterrole.rbac.authorization.k8s.io/ingress-nginx created
# clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
# rolebinding.rbac.authorization.k8s.io/ingress-nginx created
# rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
# clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
# clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
# configmap/ingress-nginx-controller created
# service/ingress-nginx-controller created
# service/ingress-nginx-controller-admission created
# deployment.apps/ingress-nginx-controller created
# job.batch/ingress-nginx-admission-create created
# job.batch/ingress-nginx-admission-patch created
# ingressclass.networking.k8s.io/nginx created
# validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created

k get ns
# NAME              STATUS   AGE
# default           Active   34h
# ingress-nginx     Active   8m41s
# kube-node-lease   Active   34h
# kube-public       Active   34h
# kube-system       Active   34h

k get all -n ingress-nginx
# NAME                                           READY   STATUS      RESTARTS   AGE
# pod/ingress-nginx-admission-create-qj2vt       0/1     Completed   0          8m18s
# pod/ingress-nginx-admission-patch-8mp9g        0/1     Completed   0          8m18s
# pod/ingress-nginx-controller-89758f7c6-rqh6f   1/1     Running     0          8m18s

# NAME                                         TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
# service/ingress-nginx-controller             LoadBalancer   10.76.12.234   34.116.75.247   80:31184/TCP,443:30725/TCP   8m21s
# service/ingress-nginx-controller-admission   ClusterIP      10.76.9.131    <none>          443/TCP                      8m21s

# NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
# deployment.apps/ingress-nginx-controller   1/1     1            1           8m21s

# NAME                                                 DESIRED   CURRENT   READY   AGE
# replicaset.apps/ingress-nginx-controller-89758f7c6   1         1         1       8m20s

# NAME                                       COMPLETIONS   DURATION   AGE
# job.batch/ingress-nginx-admission-create   1/1           11s        8m21s
# job.batch/ingress-nginx-admission-patch    1/1           12s        8m20s
```

- Google Cloud -> Networking -> Network services -> Load balancing
- a loadbalancer has been created.
- IP:Port - 34.116.75.247:80-443

#### Modify the hosts file

```sh
sudo vim /etc/hosts
# add this
# 34.116.75.247 ticketing.dev
```

### 131. Final Config and Test

```sh
skaffold dev
# Generating tags...
#  - us.gcr.io/ticketing-dev-377721/auth -> us.gcr.io/ticketing-dev-377721/auth:432e9c2
# Checking cache...
#  - us.gcr.io/ticketing-dev-377721/auth: Not found. Building
# Starting build...
# Building [us.gcr.io/ticketing-dev-377721/auth]...
# Target platforms: [linux/amd64]
# Cleaning up...
#  - No resources found
# build [us.gcr.io/ticketing-dev-377721/auth] failed: getting cloudbuild client: google: could not find default credentials. See https://developers.google.com/accounts/docs/application-default-credentials for more information.

gcloud auth application-default login
# Your browser has been opened to visit:

#     https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8085%2F&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=L6IMYcVq1PUTURUrYuvkfCLXz9DfpB&access_type=offline&code_challenge=UmxS9t6VkglwNxKkDIBncuRBcrDj-6rxjCHTSHP4Azc&code_challenge_method=S256


# Credentials saved to file: [/Users/noah/.config/gcloud/application_default_credentials.json]

# These credentials will be used by any library that requests Application Default Credentials (ADC).

# Quota project "ticketing-dev-377721" was added to ADC which can be used by Google client libraries for billing and quota. Note that some services may still bill the project owning the resource.

skaffold dev
# Generating tags...
#  - us.gcr.io/ticketing-dev-377721/auth -> us.gcr.io/ticketing-dev-377721/auth:432e9c2
# Checking cache...
#  - us.gcr.io/ticketing-dev-377721/auth: Not found. Building
# Starting build...
# Building [us.gcr.io/ticketing-dev-377721/auth]...
# Target platforms: [linux/amd64]
# Pushing code to gs://ticketing-dev-377721_cloudbuild/source/ticketing-dev-377721-f9ab11e7-a1fc-4b73-80da-c54b97bc7913.tar.gz
# Logs are available at
# https://storage.cloud.google.com/ticketing-dev-377721_cloudbuild/log-d2aa9192-e248-49fc-9165-97f60afef016.txt
# starting build "d2aa9192-e248-49fc-9165-97f60afef016"

# FETCHSOURCE

# ...

# bdff5591dbb5: Pushed
# d1f7de2f26d1: Pushed
# 2cec6047270a: Pushed
# 432e9c2: digest: sha256:4ff841d1e2f7b36e277197bc0ea6fb9749a15af619a69ab3cb82ba810d879255 size: 1993
# DONE
# Build [us.gcr.io/ticketing-dev-377721/auth] succeeded
# Tags used in deployment:
#  - us.gcr.io/ticketing-dev-377721/auth -> us.gcr.io/ticketing-dev-377721/auth:432e9c2@sha256:4ff841d1e2f7b36e277197bc0ea6fb9749a15af619a69ab3cb82ba810d879255
# Starting deploy...
#  - deployment.apps/auth-depl created
#  - service/auth-srv created
#  - ingress.networking.k8s.io/ingress-service created
# Waiting for deployments to stabilize...
#  - deployment/auth-depl: creating container auth
#     - pod/auth-depl-68f98dfcc7-tj6nm: creating container auth
#  - deployment/auth-depl is ready.
# Deployments stabilized in 18.149 seconds
# Listing files to watch...
#  - us.gcr.io/ticketing-dev-377721/auth
# Press Ctrl+C to exit
# Watching for changes...
# [auth]
# [auth] > auth@1.0.0 start
# [auth] > ts-node-dev src/index.ts
# [auth]
# [auth] [INFO] 08:22:47 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.9.5)
# [auth] Listening on port 3000!!!!!!
```

Check Google Cloud -> Cloud Build -> History

- Navigate https://ticketing.dev/api/users/currentuser to check
- type `thisisunsafe` again

> However, when I chnage the code, the console says `Syncing 1 files for us.gcr.io/ticketing-dev-377721/auth:432e9c2-dirty@sha256:2792c3277add2b91ac7b07eb21d6025fa2c50daeb070ad77221f4388b24df606`\
> but it doesn't always get updated on the browser. the changes get applied after restart (=skaffold dev)

#### Rollback and clean up Google Cloud part

I will use kubernetes cluster on my local and won't use google cloud for this course.

So the cluster and load balancer (including backend) should be deleted.

</details>
