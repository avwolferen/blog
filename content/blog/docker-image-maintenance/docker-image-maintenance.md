## Housekeeping Your Sitecore Docker Images

### Why is this important?
If you work with Sitecore XM Cloud and regularly update your Docker images, old images will remain on your system. Especially with large projects, this can quickly take up a lot of disk space. Untagged images are difficult to remove manually and can sometimes cause errors during build processes.

### The problem: Outdated and untagged images
Every time you download a new version of a Sitecore base image, the old version is not automatically deleted. Over time, these images accumulate, potentially wasting gigabytes of space.

**Screenshot suggestion:**  
_Add a screenshot of your Docker Desktop or the output of `docker image ls` showing a long list of Sitecore/XM Cloud images, including untagged ones._

---

### The solution: Automatic cleanup with PowerShell

With this PowerShell script, you can quickly remove unused and old Sitecore or XM Cloud images:

```powershell
docker system prune -f
docker image ls --format json | ConvertFrom-Json | ForEach-Object {
    if ($_.Repository -match "sitecore|xmcloud") {
        Write-Host "Forcibly removing $($_.Repository) by ID" -ForegroundColor Yellow
        docker rmi $_.ID -f
    }
}
```

#### Explanation of the steps:
- `docker system prune -f` removes unused containers, networks, and images.
- Then, the script finds all images with “sitecore” or “xmcloud” in the name and deletes them by ID. This also works for untagged images.
- You can add your own project name to the match (for example, `"sitecore|xmcloud|myproject"`).

**Screenshot suggestions:**  
1. _Show the terminal before running the script, displaying many Sitecore/XM Cloud images._  
2. _Show the PowerShell window running the script (with some output lines present)._  
3. _Show the terminal after running the script, with the images cleaned up._

---

### Tip: Consistency is key!
Make it a habit to run this script after major updates or during routine maintenance. This keeps your development machine fast and clean.

**Screenshot suggestion:**  
_Add a screenshot of your disk usage before and after cleanup to demonstrate the space savings._

---

Would you like help with creating or annotating the screenshots, or do you want advice on how to take them (e.g., commands, tools)? Let me know what you need next!