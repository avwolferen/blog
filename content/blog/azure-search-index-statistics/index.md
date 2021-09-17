---
title: "Sitecore Content Search - Azure Search Statics"
date: "2021-09-13"
categories: 
  - "sitecore"
tags: 
  - "sitecore"
  - "azure"
  - "search"
  - "solr"
  - "azure search"
  - "statistics"
img: "azuresearch-index-statistics.png"
coverImage: "azuresearch-index-statistics.png"
---

When you are running Sitecore on Azure as a PaaS and are using Azure Search as your Content Search provider, or whether you are using Azure Search apart from that, you should be able to get statistics easily available besides running to that Azure Portal or Sitecore Indexing Manager. This blog shows how you can manage that with just a simple PowerShell script.

## TL;DR;

The PowerShell script can be found here. [https://github.com/avwolferen/azuresearch-stats](Azure Search Statistics). Running the [https://github.com/avwolferen/azuresearch-stats/blob/main/Test.ps1](Test.ps1)] will prompt you with logging into or selecting the proper credentials and subscription. It will list the statistics for all Azure Search resources in the selected subscription. 

## Queastion: What is accesible in the Sitecore Indexing Manager?

In the Sitecore Indexing Manager you can access the latest statistics that Sitecore is able to determine based on its own data collected by the Indexing Custodian and Indexing Jobs. This data does not come from Azure Search API's.

## Question: What is accesible in the Azure Portal?



## Question: Where can you get your data from?

Azure Search has a few API methods that you can use to get information from your indexes. Not only the names of the indexes, but also the entire field configuration. More about the Azure Search API's can be found here []()

## Question: Why would you need this data?

The reason behind this PowerShell script is that if you happen to migrate to Sitecore 10.2 and further the support for Azure Search is dropped. More about this can be found here [](). That means you have to go to SOLR. If you want to make a good estimate of how many data is actually in your Azure Search indexen then you can use this script to find not only the number of indexes but also the number of documents, fieldscount and sizes of your indexes.

## The Script

The script for this can be 

## Question: Is there a SOLR alternative for his script?

SOLR does provide a wide variety of API access. The alternative for this script will be posted on my GitHub repository and this blog will be updated. If you are interested please watch the repository [https://github.com/avwolferen/azuresearch-stats](Azure Search Statistics).


## Conclusion

That's it for now. I hope I have helped a couple of people getting easy statistics from Azure Search.