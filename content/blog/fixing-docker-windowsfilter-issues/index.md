---
title: "How to fix issues after accidentally cleaning up stuff in your windowsfilter"
date: "2026-03-04"
categories: 
  - "sitecore"
tags: 
  - "docker"
  - "sitecore"
  - "xmcloud"
---

They tell you never to manually remove directories, what can go wrong?

Sometimes it is good to introduce some chaos to your system, this time I intentionally removed some layers in the `C:\ProgramData\Docker\image\windowsfilter\layerdb\sha256\` directory. What happens next is that Docker is not able to find the extracted layers anymore on your system. It is not able to recover from this even after a dozen of `docker system prune -f` commands :)

## The errors appeared

When building my images I got errors like these:

```
failed to get layer for image sha256:96713412f5d8a571e94a4396dd656aefcf09ee91e7329ed2d5c8c3da991cf90e: layer does not exist
```

and

```
failed to register layer: rename C:\ProgramData\Docker\image\windowsfilter\layerdb\tmp\write-set-3770558273 C:\ProgramData\Docker\image\windowsfilter\layerdb\sha256\9a7c514ec82c7976c7b84909b30e88dee078b3083659f7b057b8f3316add8875: Access is denied.
```

## How to overcome this issue?

My action resulted in a corrupted imagedb and layerdb. Next I removed the entire contents of the `C:\ProgramData\Docker\image\windowsfilter` directory. I then tried to build my image again, it did quite some layer pulls but it prompted me with a different error.

```
failed to write digest data: invalid output path: CreateFile C:\ProgramData\Docker\image\windowsfilter\imagedb\content\sha256: The system cannot find the path specified.
```

It is rather curious to see that Docker actually did create the directories for layerdb and distribution, but it lacked in scaffolding the imagedb directory. I just created it manually in my trusty cmd prompt.

```
mkdir imagedb && cd imagedb && mkdir content && cd content && mkdir sha256 && cd ..\..\
```

After this I was happily building my images again.

![Docker build success](https://github.com/user-attachments/assets/96fb1d77-f6be-48e1-ae9b-822bc4b95b12)

## Happy coding!

If you like this blogpost please let me know! If you have anything to add please pingback.
