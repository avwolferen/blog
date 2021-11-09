---
title: "A parameter cannot be found that matches parameter name 'AllowPrerelease'"
date: "2021-11-09"
categories: 
  - "sitecore"
tags: 
  - "sitecore"
  - "docker"
  - "powershell"
  - "AllowPrerelease"
img: "images/allowprerelease.png"
coverImage: "images/allowprerelease.png"
---

```
D:\git\alex\sitecore-102\compose\ltsc2019\xp0\compose-init.ps1 : A parameter cannot be found that matches parameter name 'AllowPrerelease'.
At line:1 char:1
+ .\compose-init.ps1
+ ~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidArgument: (:) [compose-init.ps1], ParameterBindingException
    + FullyQualifiedErrorId : NamedParameterNotFound,compose-init.ps1
```

## You are simply not up to date on PowerShell modules

To resolve this you need to update two modules. PackageManagement and PowerShellGet. Open a PowerShell window and execute the following commands.

```
Install-Module -Name PackageManagement -Repository PSGallery -Force -AllowClobber
Install-Module -Name PowerShellGet -Repository PSGallery -Force -AllowClobber
```

The output should look pretty similar like this.

```
PS D:\git\alex\sitecore-102\compose\ltsc2019\xp0> Install-Module -Name PackageManagement -Repository PSGallery -Force -AllowClobber

WARNING: The version '1.4.7' of module 'PackageManagement' is currently in use. Retry the operation after closing the applications.
PS D:\git\alex\sitecore-102\compose\ltsc2019\xp0> Install-Module -Name PowerShellGet -Repository PSGallery -Force -AllowClobber

WARNING: The version '1.4.7' of module 'PackageManagement' is currently in use. Retry the operation after closing the applications.
PS D:\git\alex\sitecore-102\compose\ltsc2019\xp0> 
```

After doing this close all your PowerShell terminals and run your init script again :)

## Happy coding!

If you like this blogpost please let me know! If you have anything to add please pingback.
