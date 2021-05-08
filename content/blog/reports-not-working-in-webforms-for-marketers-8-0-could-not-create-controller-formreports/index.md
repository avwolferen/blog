---
title: "Reports not working in Webforms For Marketers 8.0? “Could not create controller: 'FormReports'”"
date: "2015-01-26"
categories: 
  - "sitecore"
tags: 
  - "form-reports"
  - "mvc"
  - "sitecore"
  - "wffm"
coverImage: "./images/FormReports.jpg"
img: "./images/FormReports.jpg"
---

Last Friday I installed Webforms For Marketers 8.0 in my Sitecore 8 instance where I’m working on a client’s Sitecore platform. After installation I added the sample ‘contact’ form to a page and published it all, I had to add the form by hand because we’ve all seen the ‘known issues’ list Sitecore 8 comes with.

# _The problem_

Last Friday I installed Webforms For Marketers 8.0 in my Sitecore 8 instance where I’m working on a client’s Sitecore platform. After installation I added the sample ‘contact’ form to a page and published it all, I had to add the form by hand because we’ve all seen the ‘known issues’ list Sitecore 8 comes with.

Right after the publish I visited the page where I had add the form I entered my emailaddress and hit the submit button. My form got submitted and I went back to Sitecore to take a look at the form reports.

I ended up with a reasonable empty form reports page so I took a look at the Sitecore Log and discovered the following.

```
===

5168 09:14:28 ERROR Application error.

Exception: Sitecore.Mvc.Diagnostics.ControllerCreationException

Message: Could not create controller: 'FormReports'.

The current route url is: 'api/sitecore/{controller}/{action}'.

Source: Sitecore.Mvc

   at Sitecore.Mvc.Controllers.SitecoreControllerFactory.CreateController(RequestContext requestContext, String controllerName)

   at System.Web.Mvc.MvcHandler.ProcessRequestInit(HttpContextBase httpContext, IController& controller, IControllerFactory& factory)

   at System.Web.Mvc.MvcHandler.BeginProcessRequest(HttpContextBase httpContext, AsyncCallback callback, Object state)

   at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute()

   at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)

 

Nested Exception

 

Exception: Sitecore.Mvc.Diagnostics.ExceptionWrapper

Message: The controller for path '/api/sitecore/FormReports/GetFormFieldsStatistics' was not found or does not implement IController.

Source: System.Web.Mvc

   at System.Web.Mvc.DefaultControllerFactory.GetControllerInstance(RequestContext requestContext, Type controllerType)

   at System.Web.Mvc.DefaultControllerFactory.CreateController(RequestContext requestContext, String controllerName)

   at Sitecore.Apps.TagInjection.DependencyResolver.TagInjectionControllerFactory.CreateController(RequestContext requestContext, String controllerName)

   at Sitecore.Mvc.Controllers.SitecoreControllerFactory.CreateController(RequestContext requestContext, String controllerName)

===
```

## _Solution_

Now this reminds me of the fact that I only had Visual Studio 2012 installed on this PC, and that 2012 got shipped with MVC 4. MVC 5 was shipped starting with Visual Studio 2013. I didn’t want to install Visual Studio 2013 so I installed the ASP.NET MVC 5 support for Visual Studio 2012 from [http://www.asp.net/mvc/mvc5](http://www.asp.net/mvc/mvc5). After installing my form report was accessible and I got rid of the exceptions in the Sitecore log.
