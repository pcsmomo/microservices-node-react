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

</details>
