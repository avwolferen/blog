---
title: "Download all 485 NuGet packages for Sitecore 10.0.0 with this one line command in under 3 minutes!"
date: "2020-08-13"
categories: 
  - "sitecore"
tags: 
  - "metapackage"
  - "nuget"
  - "package-manager-console"
  - "sitecore"
  - "sitecore-metapackage"
  - "timesaver"
  - "visual-studio"
coverImage: "Download-all-485-NuGet-packages-for-Sitecore-10.0.0-with-this-one-line-command-in-under-3-minutes.png"
---

Are you wondering how fast and easy you can get those packages for Sitecore 10.0.0 downloaded with all possible package dependencies in a jiffy?

## This one-line command will get you there!

```
$version="10.0.0";$targetDirectory=".\sitecore1000";Install-Package -Id Sitecore -Version $version -Source https://sitecore.myget.org/F/sc-packages/api/v3/index.json -DependencyVersion Lowest;if (-not (Test-Path $targetDirectory)){New-Item -Path $targetDirectory -Type Directory};Copy-Item -Path ".\packages\**\*.nupkg" -Destination $targetDirectory -Recurse -Force

Successfully installed 'Sitecore 10.0.0' to WebApplication3
Executing nuget actions took 2,51 min
```

Try it out for yourself and clone this git repo to test it out.  
[https://github.com/avwolferen/SitecoreNugetter](https://github.com/avwolferen/SitecoreNugetter)  
Do it now! The packages are faster than you can read this entire blogpost.

## Back in the "old" days ;)

I guess a lot of people worked with the Powershell script by Bas Lijten [http://blog.baslijten.com/private-sitecore-nuget-feeds-using-vsts-why-we-dont-use-sitecore-myget-and-how-we-work-with-package-management/](http://blog.baslijten.com/private-sitecore-nuget-feeds-using-vsts-why-we-dont-use-sitecore-myget-and-how-we-work-with-package-management/) where he downloads all those Sitecore 9.0.1 nuget packages to use in a private feed. Well, this one will take care of that way easier then it was before.

## Sitecore Meta-package

Sitecore is doing a lot of awesome stuff. A few months ago Mark van Aalst blogged about the excellent targets file that Sitecore pushed to their MyGet feed. That Sitecore.Assemblies package contains an actual .targets file that you can use to minimize the payload of your web deployments. He covers this in a really nice post [Excluding Sitecore assemblies using NuGet](https://dev.to/sitecore/excluding-sitecore-assemblies-using-nuget-5h4l)

By the way, this will also greatly reduce the size of your _[solution image](https://containers.doc.sitecore.com/docs/build-solution#build-the-solution-image)_ if you are going the Docker way!

## How it works

First of all you need create an empty Web Application with .NET framework 4.8 as the target version.  
Next you need to execute the command from the very start of this blogpost.

## Decomposition

The one-line command can be split into a few tiny parts. To explain what is actually doing I'll cover those one by one and also tell what the most important bits are.

```
_$version="10.0.0";_
```

Of course you need to tell what version of Sitecore you want to have. In this case it is just 10.0.0

```
$targetDirectory=".\\sitecore1000";
```

You need to tell what your target directory will be.

```
Install-Package -Id Sitecore -Version $version -Source https://sitecore.myget.org/F/sc-packages/api/v3/index.json -DependencyVersion Lowest;
```

The easiest way to install NuGet packages and getting rid of all those wise License dialogs ;)  
The Id of the package is Sitecore, because that is the actual name of the package.  
The version that we are installing here is 10.0.0 the latest and greatest. Remember when there is a new version of Sitecore available you can just edit those this version. Small detail on that later.

```
if (-not (Test-Path $targetDirectory)) { New-Item -Path $targetDirectory -Type Directory };
```

If the target directory doesn't exist yet it will be created. If you happen to have a collection of files in that location it will not harm them, except when they have the exact same filename!

```
Copy-Item -Path ".\\packages\\\*\*\\\*.nupkg" -Destination $targetDirectory -Recurse -Force
```

Easy Copy-Item command that gathers all .nupkg files and copies them to the target directory, and overwrites any existing files.

## Good to know

This way of downloading works for all Sitecore versions starting from 7.2120288. 
Please take note of the required targetframework version of the Web Application matches with the one the Sitecore version you are working with is using.

<table><tbody><tr><td>Sitecore version</td><td>Target Framework version</td></tr><tr><td>10.0.0</td><td>.NET 4.8</td></tr><tr><td>9.3.0</td><td>.NET 4.7.1</td></tr><tr><td>9.2.0</td><td>.NET 4.7.1</td></tr><tr><td>9.1.1</td><td>.NET 4.7.1</td></tr><tr><td>9.1.0</td><td>.NET 4.7.1</td></tr><tr><td>9.0.180604</td><td>.NET 4.6.2</td></tr><tr><td>9.0.171219</td><td>.NET 4.6.2</td></tr><tr><td>9.0.171002</td><td>.NET 4.6.2</td></tr></tbody></table>

And so on... and so on...

## Happy coding!

If you like this blogpost please let me know! If you have anything to add please pingback.
