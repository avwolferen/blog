---
title: "Sitecore and Microsoft Bot Framework - Part 5 - User Management"
date: "2017-09-02"
categories: 
  - "sitecore"
tags: 
  - "luis"
  - "microsoft-bot-framework"
  - "sitecore"
coverImage: "./user-manager.jpg"
img: "./user-manager.jpg"
---

Managing Sitecore users normally requires you to log into Sitecore, navigate to the User Manager and lookup the specific user. This could also be done with the bot.

## Sitecore User Management with the Microsoft Bot Framework

Whether you would like to create, delete, disable or enable users in Sitecore you could also ask the Bot to do that for you in your UserContext.

Getting a list of users in a specific domain.

![](images/usermanagement-list-users.jpg)

Trying to enable a user that isn’t disabled at all gives a proper response.

![](images/usermanagement-enable-user.jpg)

Deleting a user is also straightforward.

![](images/usermanagement-delete-user.jpg)

And if you would like to delete your own account, the API prevents you from doing that.

![](images/usermanagement-delete-self.jpg)

## Read more!
