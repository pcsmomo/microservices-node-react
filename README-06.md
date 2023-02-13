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

</details>
