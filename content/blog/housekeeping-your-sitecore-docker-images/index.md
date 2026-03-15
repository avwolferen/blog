---
title: "Housekeeping Your Sitecore Docker Images"
date: "2026-03-15"
categories: 
  - "sitecore"
tags: 
  - "sitecore"
  - "xmc"
  - "xm cloud"
  - "sitecore ai"
  - "docker"
  - "images"
  - "housekeeping"
---

## Introduction

From time to time, updates are released for the Sitecore XM Cloud base images due to new and/or updated features. When you start your local containers using the up.ps1 script, you'll notice that the new image starts downloading. Everything works well, and you're all set with the updated image. However, you may observe that the footprint of your images is increasing; the previously downloaded images will still be present on your machine. Using extensions in VS Code may not be effective when you want to remove those old images, as they appear to be in an 'untagged' state. These old images can be difficult to remove and may contain vulnerable tools that are still extracted on your machine, hidden somewhere.

## Script for housekeeping

To ensure proper housekeeping, you might want to run the following script every once in a while week to cleanup your images.

> **Warning:** Make sure to stop all running containers before executing this script, as it will forcibly remove **all** images whose repository name contains "sitecore" or "xmcloud" — including any images that are currently in use. Run `docker-compose down` (or your project's equivalent down script) before proceeding.

If you happen to use some custom naming yourself you might want to use a different match pattern instead of `sitecore|xmcloud`.

```powershell
docker system prune -f

docker image ls --format json | 
    ConvertFrom-Json | 
    ForEach-Object { 
        if ($_.Repository -match "sitecore|xmcloud") { 
            Write-Host "Forcibly removing $($_.Repository) by ID" -ForegroundColor Yellow
            docker rmi $_.ID -f 
        } 
    }
```

## docker system prune -f

This command removes all unused containers, networks, and dangling images. It helps to clean up unused resources and can improve the performance of your system. Note that volumes are **not** removed unless you also pass the `--volumes` flag.

## docker image ls --format json

This command lists all images available on your machine and formats the output as JSON for further processing. This makes it easier to filter and manage specific images.

## if ($_.Repository -match "sitecore|xmcloud")

This line ensures that only images containing "sitecore" or "xmcloud" in their name are processed for housekeeping. If you want to clean up your old project images as well, you can add your project name to this command, separating it with a pipe.

## docker rmi $_.ID -f

This command removes the image based on the ID of the image. It is important to note that untagged images can only be removed by their ID, as they do not have a name that you can use.

## Conclusion

> **Warning:** This script will remove ANY image with a name matching the filter.

By performing regular housekeeping, you not only free up disk space but also ensure that your images remain up-to-date. This is crucial for the security and performance of your development environment. Consider making this process a part of your maintenance routine.
