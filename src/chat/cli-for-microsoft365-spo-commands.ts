/* eslint-disable quotes */

export const Commands = [
  {
    "Command": "m365 spo orgnewssite list",
    "Description": "Lists all organizational news sites",
    "Options": null,
    "Examples": [
      {
        "Example": "List all organizational news sites",
        "Description": "m365 spo orgnewssite list"
      }
    ]
  },
  {
    "Command": "m365 spo web list",
    "Description": "Lists subsites of the specified site",
    "Options": "`-u, --url <url>`: URL of the parent site for which to retrieve the list of subsites",
    "Examples": [
      {
        "Example": "Return all subsites from site https://contoso.sharepoint.com/",
        "Description": "m365 spo web list --url https://contoso.sharepoint.com"
      }
    ]
  },
  {
    "Command": "m365 spo listitem attachment list",
    "Description": "Gets the attachments associated to a list item",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site from which the item should be retrieved.`--listId [listId]`: ID of the list where the item should be retrieved. Specify either `listTitle`, `listId` or `listUrl`.`--listTitle [listTitle]`: Title of the list where the item should be retrieved. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listItemId <listItemId>`: ID of the list item.",
    "Examples": [
      {
        "Example": "Gets the attachments from list item with the specified listItemId in list with the specified title in the specified site.",
        "Description": "m365 spo listitem attachment list --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle \"Demo List\" --listItemId 147"
      },
      {
        "Example": "Gets the attachments from list item with the specified listItemId in list with the specified id in the specified site.",
        "Description": "m365 spo listitem attachment list --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf --listItemId 147"
      },
      {
        "Example": "Gets the attachments from a specific list item in a specific list obtained by server-relative URL in a specific site.",
        "Description": "m365 spo listitem attachment list --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl /sites/project-x/Documents --listItemId 147"
      }
    ]
  },
  {
    "Command": "m365 spo list get",
    "Description": "Gets information about the specific list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list to retrieve is located.`-i, --id [id]`: ID of the list to retrieve information for. Specify either `id`, `title`, or `url` but not multiple.`-t, --title [title]`: Title of the list to retrieve information for. Specify either `id`, `title`, or `url` but not multiple.`--url [url]`: Server- or site-relative URL of the list. Specify either `id`, `title`, or `url` but not multiple.`-p, --properties [properties]`: Comma-separated list of properties to retrieve from the list. Will retrieve all properties possible from default response, if not specified.`--withPermissions`: Set if you want to return associated roles and permissions of the list.",
    "Examples": [
      {
        "Example": "Get information about a list with specified ID located in the specified site.",
        "Description": "m365 spo list get --id 0cd891ef-afce-4e55-b836-fce03286cccf --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get information about a list with specified title located in the specified site.",
        "Description": "m365 spo list get --title Documents --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get information about a list with specified server relative url located in the specified site.",
        "Description": "m365 spo list get --url 'sites/project-x/Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get information about a list with specified site-relative URL located in the specified site.",
        "Description": "m365 spo list get --url 'Shared Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get information about a list returning the specified list properties.",
        "Description": "m365 spo list get --title Documents --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Title,Id,HasUniqueRoleAssignments,AllowContentTypes\""
      },
      {
        "Example": "Get information about a list returning the list Id, Title and ServerRelativeUrl properties.",
        "Description": "m365 spo list get --title Documents --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Title,Id,RootFolder/ServerRelativeUrl\""
      },
      {
        "Example": "Get information about a list along with the roles and permissions.",
        "Description": "m365 spo list get --title Documents --webUrl https://contoso.sharepoint.com/sites/project-x --withPermissions"
      }
    ]
  },
  {
    "Command": "m365 spo page get",
    "Description": "Gets information about the specific modern page",
    "Options": "`-n, --name <name>`: Name of the page to retrieve.`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.`--metadataOnly`: Specify to only retrieve the metadata without the section and control information.",
    "Examples": [
      {
        "Example": "Get information about the modern page.",
        "Description": "m365 spo page get --webUrl https://contoso.sharepoint.com/sites/team-a --name home.aspx"
      },
      {
        "Example": "Get all the metadata from the modern page, without the section and control count information.",
        "Description": "m365 spo page get --webUrl https://contoso.sharepoint.com/sites/team-a --name home.aspx --metadataOnly"
      }
    ]
  },
  {
    "Command": "m365 spo folder sharinglink list",
    "Description": "Lists all the sharing links of a specific folder",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the folder is located.`--folderUrl [folderUrl]`: The server- or site-relative decoded URL of the folder. Specify either `folderUrl` or `folderId` but not both.`--folderId [folderId]`: The UniqueId (GUID) of the folder. Specify either `folderUrl` or `folderId` but not both.`-s, --scope [scope]`: Filter the results to only sharing links of a given scope: `anonymous`, `users` or `organization`. By default all sharing links are listed.",
    "Examples": [
      {
        "Example": "List sharing links of a folder by id.",
        "Description": "m365 spo folder sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --folderId daebb04b-a773-4baa-b1d1-3625418e3234"
      },
      {
        "Example": "List sharing links of a folder by url.",
        "Description": "m365 spo folder sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --folderUrl \"/sites/demo/shared documents/folder\""
      },
      {
        "Example": "List anonymous sharing links of a folder by url.",
        "Description": "m365 spo folder sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --folderUrl \"/sites/demo/shared documents/folder\" --scope anonymous"
      }
    ]
  },
  {
    "Command": "m365 spo term set list",
    "Description": "Lists taxonomy term sets from the given term group",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to list term sets from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.`--termGroupId [termGroupId]`: ID of the term group from which to retrieve term sets. Specify `termGroupName` or `termGroupId` but not both.`--termGroupName [termGroupName]`: Name of the term group from which to retrieve term sets. Specify `termGroupName` or `termGroupId` but not both.",
    "Examples": [
      {
        "Example": "List taxonomy term sets from the term group with the given name.",
        "Description": "m365 spo term set list --termGroupName PnPTermSets"
      },
      {
        "Example": "List taxonomy term sets from the term group with the given ID.",
        "Description": "m365 spo term set list --termGroupId 0e8f395e-ff58-4d45-9ff7-e331ab728beb"
      },
      {
        "Example": "List taxonomy term sets from the specified sitecollection, from the term group with the given name.",
        "Description": "m365 spo term set list --termGroupName PnPTermSets --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo page control get",
    "Description": "Gets information about the specific control on a modern page",
    "Options": "`-i, --id <id>`: ID of the control to retrieve information for.`-n, --pageName <pageName>`: Name of the page where the control is located.`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.",
    "Examples": [
      {
        "Example": "Get information about the control with ID 3ede60d3-dc2c-438b-b5bf-cc40bb2351e1 placed on a modern page with name home.aspx",
        "Description": "m365 spo page control get --id 3ede60d3-dc2c-438b-b5bf-cc40bb2351e1 --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx"
      }
    ]
  },
  {
    "Command": "m365 spo term set get",
    "Description": "Gets information about the specified taxonomy term set",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to get a term set from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.`-i, --id [id]`: ID of the term set to retrieve. Specify `name` or `id` but not both.`-n, --name [name]`: Name of the term set to retrieve. Specify `name` or `id` but not both.`--termGroupId [termGroupId]`: ID of the term group to which the term set belongs. Specify `termGroupId` or `termGroupName` but not both.`--termGroupName [termGroupName]`: Name of the term group to which the term set belongs. Specify `termGroupId` or `termGroupName` but not both.",
    "Examples": [
      {
        "Example": "Get information about a taxonomy term set using its ID.",
        "Description": "m365 spo term set get --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb --termGroupName PnPTermSets"
      },
      {
        "Example": "Get information about a taxonomy term set using its name.",
        "Description": "m365 spo term set get --name PnP-Organizations --termGroupId 0a099ee9-e231-4ae9-a5b6-d7f94a0d241d"
      },
      {
        "Example": "Get information about a taxonomy term set using its ID from the specified sitecollection.",
        "Description": "m365 spo term set get --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb --termGroupName PnPTermSets --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo tenant applicationcustomizer list",
    "Description": "Retrieves a list of application customizers that are installed tenant-wide",
    "Options": null,
    "Examples": [
      {
        "Example": "Retrieves a list of application customizers.",
        "Description": "m365 spo tenant applicationcustomizer list"
      }
    ]
  },
  {
    "Command": "m365 spo file get",
    "Description": "Gets information about the specified file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--url [url]`: The server- or site-relative decoded URL of the file to retrieve. Specify either `url` or `id` but not both.`-i, --id [id]`: The UniqueId (GUID) of the file to retrieve. Specify either `url` or `id` but not both.`--asString`: Set to retrieve the contents of the specified file as string.`--asListItem`: Set to retrieve the underlying list item.`--asFile`: Set to save the file to the path specified in the path option.`-p, --path [path]`: The local path where to save the retrieved file. Must be specified when the `--asFile` option is used.`--withPermissions`: Set if you want to return associated roles and permissions.",
    "Examples": [
      {
        "Example": "Get file properties for a file with id (UniqueId) parameter located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --id 'b2307a39-e878-458b-bc90-03bc578531d6'"
      },
      {
        "Example": "Get contents of the file with id (UniqueId) parameter located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --id 'b2307a39-e878-458b-bc90-03bc578531d6' --asString"
      },
      {
        "Example": "Get list item properties for a file with id (UniqueId) parameter located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --id 'b2307a39-e878-458b-bc90-03bc578531d6' --asListItem"
      },
      {
        "Example": "Saves the file with id (UniqueId) parameter located in a site to a local file.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --id 'b2307a39-e878-458b-bc90-03bc578531d6' --asFile --path /Users/user/documents/SavedAsTest1.docx"
      },
      {
        "Example": "Return file properties for a file with server-relative url located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --url '/sites/project-x/documents/Test1.docx'"
      },
      {
        "Example": "Returns a file as string for a file with server-relative url located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --url '/sites/project-x/documents/Test1.docx' --asString"
      },
      {
        "Example": "Returns the list item properties for a file with the server-relative url located in a site.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --url '/sites/project-x/documents/Test1.docx' --asListItem"
      },
      {
        "Example": "Saves a file with the server-relative url located in a site to a local file.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --url '/sites/project-x/documents/Test1.docx' --asFile --path /Users/user/documents/SavedAsTest1.docx"
      },
      {
        "Example": "Gets the file properties for a file with id (UniqueId) parameter located in a site with permissions.",
        "Description": "m365 spo file get --webUrl https://contoso.sharepoint.com/sites/project-x --id 'b2307a39-e878-458b-bc90-03bc578531d6' --withPermissions"
      }
    ]
  },
  {
    "Command": "m365 spo cdn policy list",
    "Description": "Lists CDN policies settings for the current SharePoint Online tenant",
    "Options": "`-t, --cdnType [cdnType]`: Type of CDN to manage. Allowed values are: `Public`, `Private`. Default `Public`.",
    "Examples": [
      {
        "Example": "Show the list of policies configured for the Public CDN.",
        "Description": "m365 spo cdn policy list"
      },
      {
        "Example": "Show the list of policies configured for the Private CDN.",
        "Description": "m365 spo cdn policy list --cdnType Private"
      }
    ]
  },
  {
    "Command": "m365 spo web retentionlabel list",
    "Description": "Get a list of retention labels that are available on a site.",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site.",
    "Examples": [
      {
        "Example": "Get a list of retention labels for the Sales site",
        "Description": "m365 spo web retentionlabel list --webUrl 'https://contoso.sharepoint.com/sites/sales'"
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign rights list",
    "Description": "Gets a list of principals that have access to a site design",
    "Options": "`-i, --siteDesignId <siteDesignId>`: The ID of the site design to get rights information from",
    "Examples": [
      {
        "Example": "Get information about rights granted for the site design with ID 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a",
        "Description": "m365 spo sitedesign rights list --siteDesignId 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a"
      }
    ]
  },
  {
    "Command": "m365 spo page section list",
    "Description": "List sections in the specific modern page",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.`-n, --pageName <pageName>`: Name of the page to list sections of.",
    "Examples": [
      {
        "Example": "List sections of a modern page",
        "Description": "m365 spo page section list --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx"
      }
    ]
  },
  {
    "Command": "m365 spo contenttypehub get",
    "Description": "Returns the URL of the SharePoint Content Type Hub of the Tenant",
    "Options": null,
    "Examples": [
      {
        "Example": "Retrieve the Content Type Hub URL",
        "Description": "m365 spo contenttypehub get"
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign task get",
    "Description": "Gets information about the specified site design scheduled for execution",
    "Options": "`-i, --id <id>`: The ID of the site design task to get information for",
    "Examples": [
      {
        "Example": "Get information about the specified site design scheduled for execution",
        "Description": "m365 spo sitedesign task get --id 6ec3ca5b-d04b-4381-b169-61378556d76e"
      }
    ]
  },
  {
    "Command": "m365 spo navigation node list",
    "Description": "Lists nodes from the specified site navigation",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site for which to retrieve navigation.`-l, --location <location>`: Navigation type to retrieve. Available options: `QuickLaunch`, `TopNavigationBar`.",
    "Examples": [
      {
        "Example": "Retrieve nodes from the top navigation.",
        "Description": "m365 spo navigation node list --webUrl https://contoso.sharepoint.com/sites/team-a --location TopNavigationBar"
      },
      {
        "Example": "Retrieve nodes from the quick launch.",
        "Description": "m365 spo navigation node list --webUrl https://contoso.sharepoint.com/sites/team-a --location QuickLaunch"
      }
    ]
  },
  {
    "Command": "m365 spo customaction list",
    "Description": "Lists user custom actions for site or site collection",
    "Options": "`-u, --webUrl <webUrl>`: Url of the site or site collection to retrieve the custom action from.`-s, --scope [scope]`: Scope of the custom action. Allowed values `Site`, `Web`, `All`. Default `All`.",
    "Examples": [
      {
        "Example": "Return details about all user custom actions located in the specified site or site collection.",
        "Description": "m365 spo customaction list --webUrl https://contoso.sharepoint.com/sites/test"
      },
      {
        "Example": "Return details about all user custom actions located in the specified site collection.",
        "Description": "m365 spo customaction list --webUrl https://contoso.sharepoint.com/sites/test --scope Site"
      },
      {
        "Example": "Return details about all user custom actions located in the specified site.",
        "Description": "m365 spo customaction list --webUrl https://contoso.sharepoint.com/sites/test --scope Web"
      }
    ]
  },
  {
    "Command": "m365 spo page section get",
    "Description": "Get information about the specified modern page section",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.`-n, --pageName <pageName>`: Name of the page to get section information of.`-s, --section <sectionId>`: ID of the section for which to retrieve information.",
    "Examples": [
      {
        "Example": "Get information about the specified section of the modern page",
        "Description": "m365 spo page section get --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx --section 1"
      }
    ]
  },
  {
    "Command": "m365 spo term list",
    "Description": "Lists taxonomy terms from the given term set",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to list terms from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.`--termGroupId [termGroupId]`: ID of the term group where the term set is located. Specify `termGroupId` or `termGroupName` but not both.`--termGroupName [termGroupName]`: Name of the term group where the term set is located. Specify `termGroupId` or `termGroupName` but not both.`--termSetId [termSetId]`: ID of the term set for which to retrieve terms. Specify `termSetId` or `termSetName` but not both.`--termSetName [termSetName]`: Name of the term set for which to retrieve terms. Specify `termSetId` or `termSetName` but not both.`--includeChildTerms`: If specified, child terms are loaded as well.",
    "Examples": [
      {
        "Example": "List taxonomy terms from the specified sitecollection, the term group and term set with the given name",
        "Description": "m365 spo term list --webUrl https://contoso.sharepoint.com/sites/project-x --termGroupName PnPTermSets --termSetName PnP-Organizations"
      },
      {
        "Example": "List taxonomy terms from the term group and term set with the given name.",
        "Description": "m365 spo term list --termGroupName PnPTermSets --termSetName PnP-Organizations"
      },
      {
        "Example": "List taxonomy terms from the term group and term set with the given ID.",
        "Description": "m365 spo term list --termGroupId 0e8f395e-ff58-4d45-9ff7-e331ab728beb --termSetId 0e8f395e-ff58-4d45-9ff7-e331ab728bec"
      },
      {
        "Example": "List taxonomy terms from the term group and term set with the given ID including child terms if any are found.",
        "Description": "m365 spo term list --termGroupId 0e8f395e-ff58-4d45-9ff7-e331ab728beb --termSetId 0e8f395e-ff58-4d45-9ff7-e331ab728bec --includeChildTerms"
      }
    ]
  },
  {
    "Command": "m365 spo app get",
    "Description": "Gets information about the specific app from the specified app catalog",
    "Options": "`-i, --id [id]`: ID of the app to retrieve information for. Specify the `id` or the `name` but not both.`-n, --name [name]`: Name of the app to retrieve information for. Specify the `id` or the `name` but not both.`-u, --appCatalogUrl [appCatalogUrl]`: URL of the tenant or site collection app catalog. It must be specified when the scope is `sitecollection`.`-s, --appCatalogScope [appCatalogScope]`: Scope of the app catalog. Allowed values: `tenant`, `sitecollection`. Defaults to `tenant`.",
    "Examples": [
      {
        "Example": "Return details about the app with the specified ID available in the tenant app catalog.",
        "Description": "m365 spo app get --id b2307a39-e878-458b-bc90-03bc578531d6"
      },
      {
        "Example": "Return details about the app with the specified name available in the tenant app catalog. Will try to detect the app catalog URL.",
        "Description": "m365 spo app get --name solution.sppkg"
      },
      {
        "Example": "Return details about the app with the specified name available in the tenant app catalog using the specified app catalog URL.",
        "Description": "m365 spo app get --name solution.sppkg --appCatalogUrl https://contoso.sharepoint.com/sites/apps"
      },
      {
        "Example": "Return details about the app with the specified ID available in the site collection app catalog of the specified site.",
        "Description": "m365 spo app get --id b2307a39-e878-458b-bc90-03bc578531d6 --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1"
      }
    ]
  },
  {
    "Command": "m365 spo term get",
    "Description": "Gets information about the specified taxonomy term",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to get a term from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.`-i, --id [id]`: ID of the term to retrieve. Specify `name` or `id` but not both.`-n, --name [name]`: Name of the term to retrieve. Specify `name` or `id` but not both.`--termGroupId [termGroupId]`: ID of the term group to which the term set belongs. Specify `termGroupId` or `termGroupName` but not both.`--termGroupName [termGroupName]`: Name of the term group to which the term set belongs. Specify `termGroupId` or `termGroupName` but not both.`--termSetId [termSetId]`: ID of the term set to which the term belongs. Specify `termSetId` or `termSetName` but not both.`--termSetName [termSetName]`: Name of the term set to which the term belongs. Specify `termSetId` or `termSetName` but not both.",
    "Examples": [
      {
        "Example": "Get information about a taxonomy term using its ID from the specified sitecollection.",
        "Description": "m365 spo term get --webUrl https://contoso.sharepoint.com/sites/project-x --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb"
      },
      {
        "Example": "Get information about a taxonomy term using its ID.",
        "Description": "m365 spo term get --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb"
      },
      {
        "Example": "Get information about a taxonomy term using its name, retrieving the parent term group and term set using their names.",
        "Description": "m365 spo term get --name IT --termGroupName People --termSetName Department"
      },
      {
        "Example": "Get information about a taxonomy term using its name, retrieving the parent term group and term set using their IDs.",
        "Description": "m365 spo term get --name IT --termGroupId 5c928151-c140-4d48-aab9-54da901c7fef --termSetId 8ed8c9ea-7052-4c1d-a4d7-b9c10bffea6f"
      }
    ]
  },
  {
    "Command": "m365 spo group member list",
    "Description": "List the members of a SharePoint Group",
    "Options": "`-u, --webUrl <webUrl>`: URL of the SharePoint site.`--groupId [groupId]`: Id of the SharePoint group. Specify either `groupName` or `groupId`, but not both.`--groupName [groupName]`: Name of the SharePoint group. Specify either `groupName` or `groupId`, but not both.",
    "Examples": [
      {
        "Example": "List the members of the group with ID for the specified web.",
        "Description": "m365 spo group member list --webUrl https://contoso.sharepoint.com/sites/SiteA --groupId 5"
      },
      {
        "Example": "List the members of the group with name for the specified web.",
        "Description": "m365 spo group member list --webUrl https://contoso.sharepoint.com/sites/SiteA --groupName \"Contoso Site Members\""
      }
    ]
  },
  {
    "Command": "m365 spo theme get",
    "Description": "Gets custom theme information",
    "Options": "`-n, --name <name>`: The name of the theme to retrieve",
    "Examples": [
      {
        "Example": "Get information about a theme",
        "Description": "m365 spo theme get --name Contoso-Blue"
      }
    ]
  },
  {
    "Command": "m365 spo cdn origin list",
    "Description": "List CDN origins settings for the current SharePoint Online tenant",
    "Options": "`-t, --type [type]`: Type of CDN to manage. Allowed values are: `Public`, `Private`. Default `Public`.",
    "Examples": [
      {
        "Example": "Show the list of origins configured for the Public CDN.",
        "Description": "m365 spo cdn origin list"
      },
      {
        "Example": "Show the list of origins configured for the Private CDN.",
        "Description": "m365 spo cdn origin list --type Private"
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign get",
    "Description": "Gets information about the specified site design",
    "Options": "`-i, --id [id]`: Site design ID. Specify either `id` or `title` but not both.`--title [title]`: Site design title. Specify either `id` or `title` but not both.",
    "Examples": [
      {
        "Example": "Get information about the site design with ID 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a",
        "Description": "m365 spo sitedesign get --id 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a"
      },
      {
        "Example": "Get information about the site design with title Contoso Site Design",
        "Description": "m365 spo sitedesign get --title \"Contoso Site Design\""
      }
    ]
  },
  {
    "Command": "m365 spo contenttype list",
    "Description": "Lists content types from specified site",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site for which to list content types.`-c, --category [category]`: Category name of content types. When defined will return only content types from specified category.",
    "Examples": [
      {
        "Example": "Retrieve site content types.",
        "Description": "m365 spo contenttype list --webUrl \"https://contoso.sharepoint.com/sites/contoso-sales\""
      },
      {
        "Example": "Retrieve site content types from the 'List Content Types' category.",
        "Description": "m365 spo contenttype list --webUrl \"https://contoso.sharepoint.com/sites/contoso-sales\" --category \"List Content Types\""
      }
    ]
  },
  {
    "Command": "m365 spo page template list",
    "Description": "Lists all page templates in the given site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site from which to retrieve available pages.",
    "Examples": [
      {
        "Example": "Lists all page templates in the given site",
        "Description": "m365 spo page template list --webUrl https://contoso.sharepoint.com/sites/team-a"
      }
    ]
  },
  {
    "Command": "m365 spo homesite get",
    "Description": "Gets information about the Home Site",
    "Options": null,
    "Examples": [
      {
        "Example": "Get information about the Home Site.",
        "Description": "m365 spo homesite get"
      }
    ]
  },
  {
    "Command": "m365 spo hidedefaultthemes get",
    "Description": "Gets the current value of the HideDefaultThemes setting",
    "Options": null,
    "Examples": [
      {
        "Example": "Get the current value of the HideDefaultThemes setting.",
        "Description": "m365 spo hidedefaultthemes get"
      }
    ]
  },
  {
    "Command": "m365 spo sitescript list",
    "Description": "Lists site script available for use with site designs",
    "Options": null,
    "Examples": [
      {
        "Example": "List all site scripts available for use with site designs",
        "Description": "m365 spo sitescript list"
      }
    ]
  },
  {
    "Command": "m365 spo term group list",
    "Description": "Lists taxonomy term groups",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to list term groups from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.",
    "Examples": [
      {
        "Example": "List taxonomy term groups.",
        "Description": "m365 spo term group list"
      },
      {
        "Example": "List taxonomy term groups from the specified sitecollection.",
        "Description": "m365 spo term group list --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo propertybag list",
    "Description": "Gets property bag values",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site from which the property bag value should be retrieved.`--folder [folder]`: Site-relative URL of the folder from which to retrieve property bag value. Case-sensitive.",
    "Examples": [
      {
        "Example": "Return property bag values located in the given site",
        "Description": "m365 spo propertybag list --webUrl https://contoso.sharepoint.com/sites/test"
      },
      {
        "Example": "Return property bag values located in the given site root folder",
        "Description": "m365 spo propertybag list --webUrl https://contoso.sharepoint.com/sites/test --folder /"
      },
      {
        "Example": "Return property bag values located in the given site document library",
        "Description": "m365 spo propertybag list --webUrl https://contoso.sharepoint.com/sites/test --folder '/Shared Documents'"
      },
      {
        "Example": "Return property bag values located in folder in the given site document library",
        "Description": "m365 spo propertybag list --webUrl https://contoso.sharepoint.com/sites/test --folder '/Shared Documents/MyFolder'"
      },
      {
        "Example": "Return property bag values located in the given site list",
        "Description": "m365 spo propertybag list --webUrl https://contoso.sharepoint.com/sites/test --folder /Lists/MyList"
      }
    ]
  },
  {
    "Command": "m365 spo applicationcustomizer get",
    "Description": "Get an application customizer that is added to a site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site.`-t, --title [title]`: The title of the Application Customizer. Specify either `title`, `id` or `clientSideComponentId`.`-i, --id [id]`: The id of the Application Customizer. Specify either `title`, `id` or `clientSideComponentId`.`-c, --clientSideComponentId  [clientSideComponentId]`: The Client Side Component Id (GUID) of the application customizer. Specify either `title`, `id` or `clientSideComponentId`.`-s, --scope [scope]`: Scope of the application customizer. Allowed values: `Site`, `Web`, `All`. Defaults to `All`.`-p, --clientSideComponentProperties`: Only output the client-side component properties.",
    "Examples": [
      {
        "Example": "Retrieves an application customizer by title.",
        "Description": "m365 spo applicationcustomizer get --title \"Some customizer\" --webUrl https://contoso.sharepoint.com/sites/sales"
      },
      {
        "Example": "Retrieves an application customizer by id.",
        "Description": "m365 spo applicationcustomizer get --id 14125658-a9bc-4ddf-9c75-1b5767c9a337 --webUrl https://contoso.sharepoint.com/sites/sales"
      },
      {
        "Example": "Retrieves an application customizer by clientSideComponentId.",
        "Description": "m365 spo applicationcustomizer get --clientSideComponentId 7096cded-b83d-4eab-96f0-df477ed7c0bc --webUrl https://contoso.sharepoint.com/sites/sales"
      },
      {
        "Example": "Retrieves an application customizer by title available at the site scope.",
        "Description": "m365 spo applicationcustomizer get --title \"Some customizer\" --webUrl https://contoso.sharepoint.com/sites/sales --scope site"
      },
      {
        "Example": "Retrieves the client-side component properties of a application customizer.",
        "Description": "m365 spo applicationcustomizer get --id 14125658-a9bc-4ddf-9c75-1b5767c9a337 --webUrl https://contoso.sharepoint.com/sites/sales --clientSideComponentProperties"
      }
    ]
  },
  {
    "Command": "m365 spo tenant commandset get",
    "Description": "Get a ListView Command Set that is installed tenant-wide",
    "Options": "`-t, --title [title]`: The title of the ListView Command Set. Specify either `title`, `id`, or `clientSideComponentId`.`-i, --id [id]`: The id of the ListView Command Set. Specify either `title`, `id`, or `clientSideComponentId`.`-c, --clientSideComponentId  [clientSideComponentId]`: The Client Side Component Id (GUID) of the ListView Command Set. Specify either `title`, `id`, or `clientSideComponentId`.`-p, --tenantWideExtensionComponentProperties`: Only output the tenant wide extension component properties.",
    "Examples": [
      {
        "Example": "Retrieves a ListView Command Set by title.",
        "Description": "m365 spo tenant commandset get --title \"Some customizer\""
      },
      {
        "Example": "Retrieves a ListView Command Set by id.",
        "Description": "m365 spo tenant commandset get --id 3"
      },
      {
        "Example": "Retrieves a ListView Command Set by clientSideComponentId.",
        "Description": "m365 spo tenant commandset get --clientSideComponentId 7096cded-b83d-4eab-96f0-df477ed7c0bc"
      }
    ]
  },
  {
    "Command": "m365 spo file version list",
    "Description": "Retrieves all versions of a file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--fileUrl [fileUrl]`: The server- or site-relative decoded URL of the file. Specify either `fileUrl` or `fileId` but not both.`-i, --fileId [fileId]`: The UniqueId (GUID) of the file. Specify either `fileUrl` or `fileId` but not both.",
    "Examples": [
      {
        "Example": "List file versions of a specific file based on the ID of the file.",
        "Description": "m365 spo file version list --webUrl https://contoso.sharepoint.com --fileId 'b2307a39-e878-458b-bc90-03bc578531d6'"
      },
      {
        "Example": "List file versions of a specific file based on the site-relative URL of the file.",
        "Description": "m365 spo file version list --webUrl https://contoso.sharepoint.com --fileUrl '/Shared Documents/Document.docx'"
      },
      {
        "Example": "List file versions of a specific file based on the server-relative URL of the file.",
        "Description": "m365 spo file version list --webUrl https://contoso.sharepoint.com/sites/project-x --fileUrl '/sites/project-x/Shared Documents/Document.docx'"
      }
    ]
  },
  {
    "Command": "m365 spo userprofile get",
    "Description": "Get SharePoint user profile properties for the specified user",
    "Options": "`-u, --userName <userName>`: Account name of the user",
    "Examples": [
      {
        "Example": "Get SharePoint user profile for the specified user",
        "Description": "m365 spo userprofile get --userName 'john.doe@mytenant.onmicrosoft.com'"
      }
    ]
  },
  {
    "Command": "m365 spo eventreceiver get",
    "Description": "Retrieves specific event receiver for the specified web, site or list by event receiver name or id.",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the web for which to retrieve the event receivers.`--listTitle [listTitle]`: The title of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`--listId [listId]`: The id of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: The url of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`-n, --name [name]`: The name of the event receiver to retrieve. Specify either `name` or `id` but not both.`-i, --id [id]`: The id of the event receiver to retrieve. Specify either `name` or `id` but not both.`-s, --scope [scope]`: The scope of which to retrieve the event receivers. Can be either `site` or `web`. Defaults to `web`. Only applicable when not specifying any of the list properties.",
    "Examples": [
      {
        "Example": "Retrieve an event receiver with the given name in the specified site.",
        "Description": "m365 spo eventreceiver get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --name 'PnP Test Receiver'"
      },
      {
        "Example": "Retrieve an event receiver with the given id in the specified site.",
        "Description": "m365 spo eventreceiver get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --scope site --id c5a6444a-9c7f-4a0d-9e29-fc6fe30e34ec"
      },
      {
        "Example": "Retrieve an event receiver with the given name for a list with the given title in the specified site.",
        "Description": "m365 spo eventreceiver get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listTitle Events --name 'PnP Test Receiver'"
      },
      {
        "Example": "Retrieve an event receiver with the given id for a list with the given ID in the specified site.",
        "Description": "m365 spo eventreceiver get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listId '202b8199-b9de-43fd-9737-7f213f51c991' --id c5a6444a-9c7f-4a0d-9e29-fc6fe30e34ec"
      },
      {
        "Example": "Retrieve an event receiver with the given name for a list with the given url in the specified site.",
        "Description": "m365 spo eventreceiver get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listUrl '/sites/contoso-sales/lists/Events' --name 'PnP Test Receiver'"
      }
    ]
  },
  {
    "Command": "m365 spo tenant recyclebinitem list",
    "Description": "Returns all modern and classic site collections in the tenant scoped recycle bin",
    "Options": null,
    "Examples": [
      {
        "Example": "Returns all modern and classic site collections in the tenant scoped recycle bin",
        "Description": "m365 spo tenant recyclebinitem list"
      }
    ]
  },
  {
    "Command": "m365 spo user list",
    "Description": "Lists all the users within specific web",
    "Options": "`-u, --webUrl <webUrl>`: URL of the web to list the users from",
    "Examples": [
      {
        "Example": "Get list of users in a web",
        "Description": "m365 spo user list --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo commandset list",
    "Description": "Get a list of ListView Command Sets that are added to a site",
    "Options": "`-u, --webUrl <webUrl>`: The url of the site.`-s, --scope [scope]`: Scope of the ListView Command Sets. Allowed values: `Site`, `Web`, `All`. Defaults to `All`.",
    "Examples": [
      {
        "Example": "Retrieves a list of ListView Command Sets.",
        "Description": "m365 spo commandset list --webUrl https://contoso.sharepoint.com/sites/sales"
      }
    ]
  },
  {
    "Command": "m365 spo propertybag get",
    "Description": "Gets the value of the specified property from the property bag",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site from which the property bag value should be retrieved.`-k, --key <key>`: Key of the property for which the value should be retrieved. Case-sensitive.`--folder [folder]`: Site-relative URL of the folder from which to retrieve property bag value. Case-sensitive.",
    "Examples": [
      {
        "Example": "Returns the value of the property from the property bag located in the given site",
        "Description": "m365 spo propertybag get --webUrl https://contoso.sharepoint.com/sites/test --key key1"
      },
      {
        "Example": "Returns the value of the property from the property bag located in root folder of the given site",
        "Description": "m365 spo propertybag get --webUrl https://contoso.sharepoint.com/sites/test --key key1 --folder /"
      },
      {
        "Example": "Returns the value of the property from the property bag located in document library of the given site",
        "Description": "m365 spo propertybag get --webUrl https://contoso.sharepoint.com/sites/test --key key1 --folder '/Shared Documents'"
      },
      {
        "Example": "Returns the value of the property from the property bag located in folder in a document library located in the given site",
        "Description": "m365 spo propertybag get --webUrl https://contoso.sharepoint.com/sites/test --key key1 --folder '/Shared Documents/MyFolder'"
      },
      {
        "Example": "Returns the value of the property from the property bag located in a list in the given site",
        "Description": "m365 spo propertybag get --webUrl https://contoso.sharepoint.com/sites/test --key key1 --folder /Lists/MyList"
      }
    ]
  },
  {
    "Command": "m365 spo list view list",
    "Description": "Lists views configured on the specified list",
    "Options": " `-u, --webUrl <webUrl>`: URL of the site where the list is located. `-i, --listId [listId]`: ID of the list for which to list configured views. Specify either `listId`, `listTitle`, or `listUrl`. `-t, --listTitle [listTitle]`: Title of the list for which to list configured views. Specify either `listId`, `listTitle`, or `listUrl`. `--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listId` , `listTitle` or `listUrl`.",
    "Examples": [
      {
        "Example": "List all views for a list by title.",
        "Description": "m365 spo list view list --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle Documents"
      },
      {
        "Example": "List all views for a list by ID.",
        "Description": "m365 spo list view list --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf"
      },
      {
        "Example": "List all views for a list by URL.",
        "Description": "m365 spo list view list --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl '/sites/project-x/lists/Events'"
      }
    ]
  },
  {
    "Command": "m365 spo tenant commandset list",
    "Description": "Retrieves a list of ListView Command Sets that are installed tenant-wide",
    "Options": null,
    "Examples": [
      {
        "Example": "Retrieves a list of ListView Command Sets.",
        "Description": "m365 spo tenant commandset list"
      }
    ]
  },
  {
    "Command": "m365 spo page list",
    "Description": "Lists all modern pages in the given site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site from which to retrieve available pages.",
    "Examples": [
      {
        "Example": "List all modern pages in the specific site.",
        "Description": "m365 spo page list --webUrl https://contoso.sharepoint.com/sites/team-a"
      }
    ]
  },
  {
    "Command": "m365 spo roledefinition list",
    "Description": "Gets list of role definitions for the specified site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site for which to retrieve role definitions.",
    "Examples": [
      {
        "Example": "Return list of role definitions for the given site",
        "Description": "m365 spo roledefinition list --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo page column list",
    "Description": "Lists columns in the specific section of a modern page",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.`-n, --pageName <pageName>`: Name of the page to list columns of.`-s, --section <sectionId>`: ID of the section for which to list columns.",
    "Examples": [
      {
        "Example": "List columns in the first section of a modern page",
        "Description": "m365 spo page column list --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx --section 1"
      }
    ]
  },
  {
    "Command": "m365 spo folder list",
    "Description": "Returns all folders under the specified parent folder",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the folders to list are located.`-p, --parentFolderUrl <parentFolderUrl>`: The server- or site-relative decoded URL of the parent folder.`--fields [fields]`: Comma-separated list of fields to retrieve. Will retrieve all fields if not specified and json output is requested.`--filter [filter]`: OData filter to use to query the list of folders with.`-r, --recursive`: Set to retrieve nested folders.",
    "Examples": [
      {
        "Example": "Gets list of folders under a parent folder with site-relative URL.",
        "Description": "m365 spo folder list --webUrl https://contoso.sharepoint.com/sites/project-x --parentFolderUrl '/Shared Documents'"
      },
      {
        "Example": "Gets recursive list of folders under a specific folder on a specific site.",
        "Description": "m365 spo folder list --webUrl https://contoso.sharepoint.com/sites/project-x --parentFolderUrl '/sites/project-x/Shared Documents' --recursive"
      },
      {
        "Example": "Return a filtered list of folders and only return the list item ID.",
        "Description": "m365 spo folder list --webUrl https://contoso.sharepoint.com/sites/project-x --parentFolderUrl '/Shared Documents' --fields ListItemAllFields/Id --filter \"startswith(Name,'Folder')\""
      }
    ]
  },
  {
    "Command": "m365 spo navigation node get",
    "Description": "Gets information about a specific navigation node.",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site.`--id <id>`: Id of the navigation node.",
    "Examples": [
      {
        "Example": "Retrieve information for a specific navigation node.",
        "Description": "m365 spo navigation node get --webUrl https://contoso.sharepoint.com/sites/team-a --id 2209"
      }
    ]
  },
  {
    "Command": "m365 spo applicationcustomizer list",
    "Description": "Get a list of application customizers that are added to a site",
    "Options": "`-u, --webUrl <webUrl>`: The url of the site.`-s, --scope [scope]`: Scope of the application customizers. Allowed values `Site`, `Web`, `All`. Defaults to `All`.",
    "Examples": [
      {
        "Example": "Retrieves a list of application customizers.",
        "Description": "m365 spo applicationcustomizer list --webUrl https://contoso.sharepoint.com/sites/sales"
      }
    ]
  },
  {
    "Command": "m365 spo page column get",
    "Description": "Get information about a specific column of a modern page",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.`-n, --pageName <pageName>`: Name of the page to get column information of.`-s, --section <section>`: ID of the section where the column is located.`-c, --column <column>`: ID of the column for which to retrieve more information.",
    "Examples": [
      {
        "Example": "Get information about the first column in the first section of a modern page",
        "Description": "m365 spo page column get --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx --section 1 --column 1"
      }
    ]
  },
  {
    "Command": "m365 spo web get",
    "Description": "Retrieve information about the specified site",
    "Options": "`-u, --url <url>`: URL of the site for which to retrieve the information`--withGroups`: Set if you want to return associated groups (associatedOwnerGroup, associatedMemberGroup and associatedVisitorGroup) along with other properties`--withPermissions`: Set if you want to return associated roles and permissions",
    "Examples": [
      {
        "Example": "Retrieve information about a site",
        "Description": "m365 spo web get --url https://contoso.sharepoint.com/subsite"
      },
      {
        "Example": "Retrieve information about a site along with associated groups for the web",
        "Description": "m365 spo web get --url https://contoso.sharepoint.com/subsite --withGroups"
      },
      {
        "Example": "Retrieve information about a site along with the RoleAssignments for the web",
        "Description": "m365 spo web get --url https://contoso.sharepoint.com/subsite --withPermissions"
      }
    ]
  },
  {
    "Command": "m365 spo field list",
    "Description": "Retrieves columns for the specified list or site",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site where fields are located.`-t, --listTitle [listTitle]`: Title of the list where fields are located. Specify either `listTitle`, `listId` or `listUrl`.`-i --listId [listId]`: ID of the list where fields are located. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or web-relative URL of the list where fields are located. Specify either `listTitle`, `listId` or `listUrl`.",
    "Examples": [
      {
        "Example": "Retrieves site columns for the specified site.",
        "Description": "m365 spo field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales"
      },
      {
        "Example": "Retrieves list columns for list Events in the specified site.",
        "Description": "m365 spo field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listTitle Events"
      },
      {
        "Example": "Retrieves list columns for the specified list in the specified site.",
        "Description": "m365 spo field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listId '202b8199-b9de-43fd-9737-7f213f51c991'"
      },
      {
        "Example": "m365 spo field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listUrl '/sites/contoso-sales/lists/Events'",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo list webhook list",
    "Description": "Lists all webhooks for the specified list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list is located.`-i, --listId [listId]`: ID of the list. Specify either `listTitle`, `listId` or `listUrl`.`-t, --listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId` or `listUrl`.",
    "Examples": [
      {
        "Example": "List all webhooks for a list with a specific ID in a specific site",
        "Description": "m365 spo list webhook list --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf"
      },
      {
        "Example": "List all webhooks for a list with a specific title in a specific site",
        "Description": "m365 spo list webhook list --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle Documents"
      },
      {
        "Example": "List all webhooks for a list with a specific URL in a specific site",
        "Description": "m365 spo list webhook list --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl '/sites/project-x/Documents'"
      }
    ]
  },
  {
    "Command": "m365 spo hubsite data get",
    "Description": "Get hub site data for the specified site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site for which to retrieve hub site data.`--forceRefresh`: Set, to refresh the server cache with the latest updates.",
    "Examples": [
      {
        "Example": "Get information about the hub site data for a specific site with URL.",
        "Description": "m365 spo hubsite data get --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo site get",
    "Description": "Gets information about the specific site collection",
    "Options": "`-u, --url <url>`: URL of the site collection to retrieve information for",
    "Examples": [
      {
        "Example": "Return information about the https://contoso.sharepoint.com/sites/project-x site collection.",
        "Description": "m365 spo site get -u https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo folder sharinglink get",
    "Description": "Gets details about a specific sharing link on a folder",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the folder is located.`--folderUrl [folderUrl]`: The server- or site-relative decoded URL of the folder. Specify either `folderUrl` or `folderId` but not both.`--folderId [folderId]`: The Unique ID (GUID) of the folder. Specify either `folderUrl` or `folderId` but not both.`-i, --id <id>`: The sharing link ID.",
    "Examples": [
      {
        "Example": "Gets a specific sharing link of a folder by id.",
        "Description": "m365 spo folder sharinglink get --webUrl https://contoso.sharepoint.com/sites/demo --id 45fa6aed-362f-48b1-b04e-6da85a526506 --folderId daebb04b-a773-4baa-b1d1-3625418e3234"
      },
      {
        "Example": "Gets a specific sharing link of a folder by url.",
        "Description": "m365 spo folder sharinglink get --webUrl https://contoso.sharepoint.com/sites/demo --id 45fa6aed-362f-48b1-b04e-6da85a526506 --folderUrl \"/sites/demo/shared documents/folder\""
      }
    ]
  },
  {
    "Command": "m365 spo web installedlanguage list",
    "Description": "Lists all installed languages on site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site for which to retrieve the list of installed languages",
    "Examples": [
      {
        "Example": "Return all installed languages from site https://contoso.sharepoint.com/",
        "Description": "m365 spo web installedlanguage list --webUrl https://contoso.sharepoint.com"
      }
    ]
  },
  {
    "Command": "m365 spo term group get",
    "Description": "Gets information about the specified taxonomy term group",
    "Options": "`-u, --webUrl [webUrl]`: If specified, allows you to get a term group from the tenant term store as well as the sitecollection specific term store. Defaults to the tenant admin site.`-i, --id [id]`: ID of the term group to retrieve. Specify `name` or `id` but not both.`-n, --name [name]`: Name of the term group to retrieve. Specify `name` or `id` but not both.",
    "Examples": [
      {
        "Example": "Get information about a taxonomy term group using its ID.",
        "Description": "m365 spo term group get --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb"
      },
      {
        "Example": "Get information about a taxonomy term group using its name.",
        "Description": "m365 spo term group get --name PnPTermSets"
      },
      {
        "Example": "Get information about a taxonomy term group from the specified sitecollection using its ID.",
        "Description": "m365 spo term group get --id 0e8f395e-ff58-4d45-9ff7-e331ab728beb --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo user get",
    "Description": "Gets a site user within specific web",
    "Options": "`-u, --webUrl <webUrl>`: URL of the web to get the user within.`-i, --id [id]`: ID of the user to retrieve information for. Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.`--email [email]`: Email of the user to retrieve information for. Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.`--loginName [loginName]`: Login name of the user to retrieve information for. Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.`--userName [userName]`: User's UPN (user principal name, eg. megan.bowen@contoso.com). Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.`--entraGroupId [entraGroupId]`: The object ID of the Microsoft Entra group. Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.`--entraGroupName [entraGroupName]`: The name of the Microsoft Entra group. Specify either `id`, `loginName`, `email`, `userName`, `entraGroupId`, or `entraGroupName`.",
    "Examples": [
      {
        "Example": "Get user by email for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --email john.doe@mytenant.onmicrosoft.com"
      },
      {
        "Example": "Get user by ID for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --id 6"
      },
      {
        "Example": "Get user by login name for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --loginName \"i:0#.f|membership|john.doe@mytenant.onmicrosoft.com\""
      },
      {
        "Example": "Get user by user's UPN for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --userName \"john.doe@mytenant.onmicrosoft.com\""
      },
      {
        "Example": "Get user by entraGroupId for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --entraGroupId f832a493-de73-4fef-87ed-8c6fffd91be6"
      },
      {
        "Example": "Get user by entraGroupName for a web.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x --entraGroupName \"Test Members\""
      },
      {
        "Example": "Get the currently logged-in user.",
        "Description": "m365 spo user get --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo cdn get",
    "Description": "View current status of the specified Microsoft 365 CDN",
    "Options": "`-t, --type [type]`: Type of CDN to manage. Allowed values are: `Public`, `Private`. Default `Public`.",
    "Examples": [
      {
        "Example": "Show if the Public CDN is currently enabled or not.",
        "Description": "m365 spo cdn get"
      },
      {
        "Example": "Show if the Private CDN is currently enabled or not.",
        "Description": "m365 spo cdn get --type Private"
      }
    ]
  },
  {
    "Command": "m365 spo group list",
    "Description": "Lists all the groups within specific web",
    "Options": "`-u, --webUrl <webUrl>`: Url of the web to list the group within.`--associatedGroupsOnly`: Get only the associated visitor, member and owner groups of the site.",
    "Examples": [
      {
        "Example": "Lists all the groups within a specific web.",
        "Description": "m365 spo group list --webUrl \"https://contoso.sharepoint.com/sites/contoso\""
      },
      {
        "Example": "Lists the associated groups within a specific web.",
        "Description": "m365 spo group list --webUrl \"https://contoso.sharepoint.com/sites/contoso\" --associatedGroupsOnly"
      }
    ]
  },
  {
    "Command": "m365 spo file version get",
    "Description": "Gets information about a specific version of a specified file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--label <label>`: Label of version which will be retrieved.`--fileUrl [fileUrl]`: The server- or site-relative decoded URL of the file to retrieve. Specify either `fileUrl` or `fileId` but not both.`-i, --fileId [fileId]`: The UniqueId (GUID) of the file to retrieve. Specify either `fileUrl` or `fileId` but not both.",
    "Examples": [
      {
        "Example": "Get file version in a specific site based on fileId.",
        "Description": "m365 spo file version get --webUrl https://contoso.sharepoint.com --label \"1.0\" --fileId 'b2307a39-e878-458b-bc90-03bc578531d6'"
      },
      {
        "Example": "Get file in a specific site based on fileUrl.",
        "Description": "m365 spo file version get --webUrl https://contoso.sharepoint.com --label \"1.0\" --fileUrl '/Shared Documents/Document.docx'"
      }
    ]
  },
  {
    "Command": "m365 spo list retentionlabel get",
    "Description": "Gets the default retention label set on the specified list or library.",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list to get the label from is located.`-l, --listId [listId]`: ID of the list to get the label from. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.`-t, --listTitle [listTitle]`: Title of the list to get the label from. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.",
    "Examples": [
      {
        "Example": "Gets retention label set on the list with specified title located in the specified site.",
        "Description": "m365 spo list retentionlabel get --listTitle ContosoList --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Gets retention label set on the list with specified id located in the specified site.",
        "Description": "m365 spo list retentionlabel get --listId cc27a922-8224-4296-90a5-ebbc54da2e85 --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Gets retention label set on the list with specified server relative url located in the specified site.",
        "Description": "m365 spo list retentionlabel get --listUrl 'sites/project-x/Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Gets retention label set on the list with specified site-relative URL located in the specified site.",
        "Description": "m365 spo list retentionlabel get --listUrl 'Shared Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo commandset get",
    "Description": "Get a ListView Command Set that is added to a site",
    "Options": "`-u, --webUrl <webUrl>`: Url of the site.`-t, --title [title]`: The title of the ListView Command Set. Specify either `title`, `id` or `clientSideComponentId`.`-i, --id [id]`: The id of the ListView Command Set. Specify either `title`, `id` or `clientSideComponentId`.`-c, --clientSideComponentId [clientSideComponentId]`: The id of the ListView Command Set. Specify either `title`, `id` or `clientSideComponentId`.`-s, --scope [scope]`: Scope of the ListView Command Set. Allowed values: `Site`, `Web`, `All`. Defaults to `All`.`-p, --clientSideComponentProperties`: Only output the client-side component properties.",
    "Examples": [
      {
        "Example": "Retrieves a ListView Command Set by title.",
        "Description": "m365 spo commandset get --title \"Some customizer\" --webUrl https://contoso.sharepoint.com/sites/sales"
      },
      {
        "Example": "Retrieves a ListView Command Set by id with scope 'Web'.",
        "Description": "m365 spo commandset get --id 14125658-a9bc-4ddf-9c75-1b5767c9a337 --webUrl https://contoso.sharepoint.com/sites/sales --scope Web"
      },
      {
        "Example": "Retrieves a ListView Command Set by clientSideComponentId with scope 'Site'.",
        "Description": "m365 spo commandset get --clientSideComponentId c1cbd896-5140-428d-8b0c-4873be19f5ac --webUrl https://contoso.sharepoint.com/sites/sales --scope Site"
      },
      {
        "Example": "Retrieves the client-side component properties of a ListView Command Set.",
        "Description": "m365 spo commandset get --id 14125658-a9bc-4ddf-9c75-1b5767c9a337 --webUrl https://contoso.sharepoint.com/sites/sales --clientSideComponentProperties"
      }
    ]
  },
  {
    "Command": "m365 spo file sharinglink get",
    "Description": "Gets details about a specific sharing link of a file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--fileUrl [fileUrl]`: The server- or site-relative decoded URL of the file. Specify either `fileUrl` or `fileId` but not both.`--fileId [fileId]`: The UniqueId (GUID) of the file. Specify either `fileUrl` or `fileId` but not both.`-i, --id <id>`: The ID of the sharing link.",
    "Examples": [
      {
        "Example": "Gets a specific sharing link of a file by id.",
        "Description": "m365 spo file sharinglink get --webUrl 'https://contoso.sharepoint.com/sites/demo' --fileId daebb04b-a773-4baa-b1d1-3625418e3234 --id 1ba739c5-e693-4c16-9dfa-042e4ec62972"
      },
      {
        "Example": "Gets a specific sharing link of a file by a specified site-relative URL.",
        "Description": "m365 spo file sharinglink get --webUrl 'https://contoso.sharepoint.com/sites/demo' --fileUrl 'Shared Documents/document.docx' --id 1ba739c5-e693-4c16-9dfa-042e4ec62972"
      },
      {
        "Example": "Gets a specific sharing link of a file by a specified server-relative URL.",
        "Description": "m365 spo file sharinglink get --webUrl 'https://contoso.sharepoint.com/sites/demo' --fileUrl '/sites/demo/Shared Documents/document.docx' --id 1ba739c5-e693-4c16-9dfa-042e4ec62972"
      }
    ]
  },
  {
    "Command": "m365 spo knowledgehub get",
    "Description": "Gets the Knowledge Hub Site URL for your tenant",
    "Options": null,
    "Examples": [
      {
        "Example": "Gets the Knowledge Hub Site URL for your tenant.",
        "Description": "m365 spo knowledgehub get"
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign task list",
    "Description": "Lists site designs scheduled for execution on the specified site",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site for which to list site designs scheduled for execution",
    "Examples": [
      {
        "Example": "List site designs scheduled for execution on the specified site",
        "Description": "m365 spo sitedesign task list --webUrl https://contoso.sharepoint.com/sites/team-a"
      }
    ]
  },
  {
    "Command": "m365 spo theme list",
    "Description": "Retrieves the list of custom themes",
    "Options": null,
    "Examples": [
      {
        "Example": "List available themes",
        "Description": "m365 spo theme list"
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign list",
    "Description": "Lists available site designs for creating modern sites",
    "Options": null,
    "Examples": [
      {
        "Example": "List available site designs",
        "Description": "m365 spo sitedesign list"
      }
    ]
  },
  {
    "Command": "m365 spo group get",
    "Description": "Gets site group",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the group is located.`-i, --id [id]`: ID of the site group to get. Use either `id`, `name` or `associatedGroup` but not multiple.`--name [name]`: Name of the site group to get. Use either `id`, `name` or `associatedGroup` but not multiple.`--associatedGroup [associatedGroup]`: Type of the associated group to get. Available values: `Owner`, `Member`, `Visitor`. Use either `id`, `name` or `associatedGroup` but not multiple.",
    "Examples": [
      {
        "Example": "Get group with ID for the specified web.",
        "Description": "m365 spo group get --webUrl https://contoso.sharepoint.com/sites/project-x --id 7"
      },
      {
        "Example": "Get group with name for the specified web.",
        "Description": "m365 spo group get --webUrl https://contoso.sharepoint.com/sites/project-x --name \"Team Site Members\""
      },
      {
        "Example": "Get the associated owner group of a specified site.",
        "Description": "m365 spo group get --webUrl https://contoso.sharepoint.com/sites/project-x --associatedGroup Owner"
      }
    ]
  },
  {
    "Command": "m365 spo file sharinginfo get",
    "Description": "Generates a sharing information report for the specified file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--fileUrl [fileUrl]`: The server- or site-relative decoded URL of the file for which to build the report. Specify either `fileUrl` or `fileId` but not both.`-i, --fileId [fileId]`: The UniqueId (GUID) of the file for which to build the report. Specify either `fileUrl` or `fileId` but not both.",
    "Examples": [
      {
        "Example": "Get file sharing information report for the file with the specified server-relative url located in the specified site.",
        "Description": "m365 spo file sharinginfo get --webUrl https://contoso.sharepoint.com/sites/project-x --fileUrl \"/sites/M365CLI/Shared Documents/SharedFile.docx\""
      },
      {
        "Example": "Get file sharing information report for file with the specified id (UniqueId) located in the specified site.",
        "Description": "m365 spo file sharinginfo get --webUrl https://contoso.sharepoint.com/sites/project-x --fileId \"b2307a39-e878-458b-bc90-03bc578531d6\""
      }
    ]
  },
  {
    "Command": "m365 spo listitem get",
    "Description": "Gets a list item from the specified list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the item is located.`-i, --id [id]`: ID of the item to retrieve. Specify either `id` or `uniqueId` but not both.`--uniqueId [uniqueId]`: The Unique ID (GUID) of the item to retrieve. Specify either `id` or `uniqueId` but not both.`-l, --listId [listId]`: ID of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`-t, --listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`-p, --properties [properties]`: Comma-separated list of properties to retrieve. Will retrieve all properties if not specified and json output is requested.`--withPermissions`: Set if you want to return associated roles and permissions.",
    "Examples": [
      {
        "Example": "Get an item with the ID parameter from a given list in a given site.",
        "Description": "m365 spo listitem get --listTitle \"Demo List\" --id 147 --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get an item with the Unique ID parameter from a given list in a given site.",
        "Description": "m365 spo listitem get --listTitle \"Demo List\" --uniqueId \"64dc28c4-3c43-45f6-ba66-307d9eb7e6aa\" --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get an item columns with the ID parameter from a given list in a given site.",
        "Description": "m365 spo listitem get --listTitle \"Demo List\" --id 147 --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Title,Created\""
      },
      {
        "Example": "Get an item columns and lookup column with the ID parameter from a given list in a given site.",
        "Description": "m365 spo listitem get --listTitle \"Demo List\" --id 147 --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Title,Created,Company/Title\""
      },
      {
        "Example": "Get an item with specific properties from a given list based on the server-relative URL in a specific site.",
        "Description": "m365 spo listitem get --listUrl /sites/project-x/documents --id 147 --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Title,Created,Company/Title\""
      },
      {
        "Example": "Get an item with ID parameter from a given list based on the server-relative URL in a specific site with permissions.",
        "Description": "m365 spo listitem get --listTitle \"Demo List\" --id 147 --webUrl https://contoso.sharepoint.com/sites/project-x --withPermissions"
      }
    ]
  },
  {
    "Command": "m365 spo list contenttype list",
    "Description": "Lists content types configured on the list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list is located.`-l, --listId [listId]`: ID of the list. Specify either `listTitle`, `listId`, or `listUrl`.`-t, --listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId`, or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId`, or `listUrl`.",
    "Examples": [
      {
        "Example": "List all content types configured on a specific list retrieved by id in a specific site.",
        "Description": "m365 spo list contenttype list --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf"
      },
      {
        "Example": "List all content types configured on a specific list retrieved by title in a specific site.",
        "Description": "m365 spo list contenttype list --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle Documents"
      },
      {
        "Example": "List all content types configured on a specific list retrieved by server relative URL in a specific site.",
        "Description": "m365 spo list contenttype list --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl 'sites/project-x/Documents'"
      }
    ]
  },
  {
    "Command": "m365 spo serviceprincipal permissionrequest list",
    "Description": "Lists pending permission requests",
    "Options": "m365 spo sp permissionrequest list",
    "Examples": [
      {
        "Example": "The admin role that's required to list permissions depends on the API. To approve permissions to any of the third-party APIs registered in the tenant, the application administrator role is sufficient. To approve permissions for Microsoft Graph or any other Microsoft API, the Global Administrator role is required.",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo site admin list",
    "Description": "Lists all administrators of a specific SharePoint site",
    "Options": "`-u, --siteUrl <siteUrl>`: The URL of the SharePoint site`--asAdmin`: List admins as admin for sites you don't have permission to",
    "Examples": [
      {
        "Example": "Lists all admins of a SharePoint site",
        "Description": "m365 spo site admin list --siteUrl https://contoso.sharepoint.com"
      },
      {
        "Example": "Lists all admins of a SharePoint site as admin",
        "Description": "m365 spo site admin list --siteUrl https://contoso.sharepoint.com --asAdmin"
      }
    ]
  },
  {
    "Command": "m365 spo tenant applicationcustomizer get",
    "Description": "Get an application customizer that is installed tenant-wide",
    "Options": "`-t, --title [title]`: The title of the application customizer. Specify either `title`, `id`, or `clientSideComponentId`.`-i, --id [id]`: The id of the application customizer. Specify either `title`, `id`, or `clientSideComponentId`.`-c, --clientSideComponentId  [clientSideComponentId]`: The Client Side Component Id (GUID) of the application customizer. Specify either `title`, `id`, or `clientSideComponentId`.`-p, --tenantWideExtensionComponentProperties`: Only output the tenant wide extension component properties.",
    "Examples": [
      {
        "Example": "Retrieves an application customizer by title.",
        "Description": "m365 spo tenant applicationcustomizer get --title \"Some customizer\""
      },
      {
        "Example": "Retrieves an application customizer by id.",
        "Description": "m365 spo tenant applicationcustomizer get --id 3"
      },
      {
        "Example": "Retrieves an application customizer by clientSideComponentId.",
        "Description": "m365 spo tenant applicationcustomizer get --clientSideComponentId 7096cded-b83d-4eab-96f0-df477ed7c0bc"
      }
    ]
  },
  {
    "Command": "m365 spo tenant settings list",
    "Description": "Lists the global tenant settings",
    "Options": null,
    "Examples": [
      {
        "Example": "Lists the settings of the tenant",
        "Description": "m365 spo tenant settings list"
      }
    ]
  },
  {
    "Command": "m365 spo eventreceiver list",
    "Description": "Retrieves event receivers for the specified web, site or list.",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the web for which to retrieve the event receivers.`--listTitle [listTitle]`: The title of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`--listId [listId]`: The id of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: The url of the list for which to retrieve the event receivers, _if the event receivers should be retrieved from a list_. Specify either `listTitle`, `listId` or `listUrl`.`-s, --scope [scope]`: The scope of which to retrieve the Event Receivers. Can be either \"site\" or \"web\". Defaults to \"web\". Only applicable when not specifying any of the list properties.",
    "Examples": [
      {
        "Example": "Retrieves event receivers in the specified site.",
        "Description": "m365 spo eventreceiver list --webUrl https://contoso.sharepoint.com/sites/contoso-sales"
      },
      {
        "Example": "m365 spo eventreceiver list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --scope site",
        "Description": "Retrieves event receivers for list with given title in the specified site."
      },
      {
        "Example": "m365 spo eventreceiver list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listTitle Events",
        "Description": "Retrieves event receivers for list with given ID in the specified site."
      },
      {
        "Example": "m365 spo eventreceiver list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listId '202b8199-b9de-43fd-9737-7f213f51c991'",
        "Description": "Retrieves event receivers for list with given url in the specified site."
      },
      {
        "Example": "m365 spo eventreceiver list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listUrl '/sites/contoso-sales/lists/Events'",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign run list",
    "Description": "Lists information about site designs applied to the specified site",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site for which to list applied site designs`-i, --siteDesignId [siteDesignId]`: The ID of the site design for which to display information",
    "Examples": [
      {
        "Example": "List site designs applied to the specified site",
        "Description": "m365 spo sitedesign run list --webUrl https://contoso.sharepoint.com/sites/team-a"
      },
      {
        "Example": "List information about the specified site design applied to the specified site",
        "Description": "m365 spo sitedesign run list --webUrl https://contoso.sharepoint.com/sites/team-a --siteDesignId 6ec3ca5b-d04b-4381-b169-61378556d76e"
      }
    ]
  },
  {
    "Command": "m365 spo contenttype get",
    "Description": "Retrieves information about the specified list or site content type",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site where the content type is located.`-l, --listTitle [listTitle]`: Title of the list (if it is a list content type). Specify either `listTitle`, `listId` or `listUrl`.`--listId [listId]`: ID of the list (if it is a list content type). Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list (if it is a list content type). Specify either `listTitle`, `listId` or `listUrl`.`-i, --id [id]`: The ID of the content type to retrieve. Specify either id or name but not both.`-n, --name [name]`: The name of the content type to retrieve. Specify either id or name but not both.",
    "Examples": [
      {
        "Example": "Retrieve site content type by id.",
        "Description": "m365 spo contenttype get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --id 0x0100558D85B7216F6A489A499DB361E1AE2F"
      },
      {
        "Example": "Retrieve site content type by name.",
        "Description": "m365 spo contenttype get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --name 'Document'"
      },
      {
        "Example": "Retrieve list (retrieved by Title) content type.",
        "Description": "m365 spo contenttype get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listTitle Events --id 0x0100558D85B7216F6A489A499DB361E1AE2F"
      },
      {
        "Example": "Retrieve list (retrieved by ID) content type.",
        "Description": "m365 spo contenttype get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listId '8c7a0fcd-9d64-4634-85ea-ce2b37b2ec0c' --id 0x0100558D85B7216F6A489A499DB361E1AE2F"
      },
      {
        "Example": "Retrieve list (retrieved by URL) content type.",
        "Description": "m365 spo contenttype get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listUrl '/Shared Documents' --id 0x0100558D85B7216F6A489A499DB361E1AE2F"
      }
    ]
  },
  {
    "Command": "m365 spo storageentity list",
    "Description": "Lists tenant properties stored on the specified SharePoint Online app catalog",
    "Options": "`-u, --appCatalogUrl <appCatalogUrl>`: URL of the app catalog site",
    "Examples": [
      {
        "Example": "List all tenant properties stored in the https://contoso.sharepoint.com/sites/appcatalog app catalog site",
        "Description": "m365 spo storageentity list -u https://contoso.sharepoint.com/sites/appcatalog"
      }
    ]
  },
  {
    "Command": "m365 spo contenttype field list",
    "Description": "Lists fields for a given site or list content type",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site where the content type is located.  `-i, --contentTypeId [contentTypeId]`  : The ID of the content type for which to list fields. Specify either `contentTypeId` or `contentTypeName`.  `-n, --contentTypeName [contentTypeName]`  : The name of the content type for which to list fields. Specify either `contentTypeId` or `contentTypeName`.  `-l, --listTitle [listTitle]`: Optional title of the list where the content type is located. Specify either `listTitle`, `listId` or `listUrl`.`--listId [listId]`: Optional ID of the list where the content type is located. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Optional server- or web-relative URL of the list where the content type is located. Specify either `listTitle`, `listId` or `listUrl`.  `-p, --properties [properties]`: Comma-separated list of properties to retrieve. Will retrieve all properties if not specified.",
    "Examples": [
      {
        "Example": "Retrieves fields for the specified site content type.",
        "Description": "m365 spo contenttype field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --contentTypeId \"0x01\""
      },
      {
        "Example": "Retrieves fields for the specified list content type in the Documents library.",
        "Description": "m365 spo contenttype field list --webUrl https://contoso.sharepoint.com/sites/contoso-sales --contentTypeName \"Document\" --listTitle \"Documents\""
      }
    ]
  },
  {
    "Command": "m365 spo folder get",
    "Description": "Gets information about the specified folder",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the folder is located.`--url [url]`: The server- or site-relative decoded URL of the folder to retrieve. Specify either `folderUrl` or `id` but not both.`-i, --id [id]`: The UniqueId (GUID) of the folder to retrieve. Specify either `url` or `id` but not both.`--withPermissions`: Set if you want to return associated roles and permissions of the folder. ",
    "Examples": [
      {
        "Example": "Get folder properties for a folder with a specific site-relative URL.",
        "Description": "m365 spo folder get --webUrl https://contoso.sharepoint.com/sites/project-x --url \"/Shared Documents\""
      },
      {
        "Example": "Get folder properties for a folder with a specific id (UniqueId).",
        "Description": "m365 spo folder get --webUrl https://contoso.sharepoint.com/sites/project-x --id \"b2307a39-e878-458b-bc90-03bc578531d6\""
      },
      {
        "Example": "Get folder properties with permissions for a folder with server-relative URL.",
        "Description": "m365 spo folder get --webUrl https://contoso.sharepoint.com/sites/test --url \"/sites/test/Shared Documents/Test1\" --withPermissions"
      }
    ]
  },
  {
    "Command": "m365 spo orgassetslibrary list",
    "Description": "List all libraries that are assigned as asset library",
    "Options": null,
    "Examples": [
      {
        "Example": "List all libraries that are assigned as asset library",
        "Description": "m365 spo orgassetslibrary list"
      }
    ]
  },
  {
    "Command": "m365 spo site appcatalog list",
    "Description": "List all site collection app catalogs within the tenant",
    "Options": null,
    "Examples": [
      {
        "Example": "List all site collection app catalogs within the tenant",
        "Description": "m365 spo site appcatalog list"
      }
    ]
  },
  {
    "Command": "m365 spo site apppermission get",
    "Description": "Get a specific application permissions for the site",
    "Options": "`-u, --siteUrl <siteUrl>`: URL of the site collection where the permission to retrieve is located`-i, --id <id>`: ID of the permission to retrieve",
    "Examples": [
      {
        "Example": "Return a specific application permissions for the https://contoso.sharepoint.com/sites/project-x site collection with permission id aTowaS50fG1zLnNwLmV4dHw4OWVhNWM5NC03NzM2LTRlMjUtOTVhZC0zZmE5NWY2MmI2NmVAZGUzNDhiYzctMWFlYi00NDA2LThjYjMtOTdkYjAyMWNhZGI0",
        "Description": "m365 spo site apppermission get --siteUrl https://contoso.sharepoint.com/sites/project-x --id aTowaS50fG1zLnNwLmV4dHw4OWVhNWM5NC03NzM2LTRlMjUtOTVhZC0zZmE5NWY2MmI2NmVAZGUzNDhiYzctMWFlYi00NDA2LThjYjMtOTdkYjAyMWNhZGI0"
      }
    ]
  },
  {
    "Command": "m365 spo site recyclebinitem list",
    "Description": "Lists items from recycle bin",
    "Options": "`-u, --siteUrl <siteUrl>`: URL of the site for which to retrieve the recycle bin items`--type [type]`: Type of items which should be retrieved. Valid values: `listItems`, `folders`, `files`.`--secondary`: Use this switch to retrieve items from secondary recycle bin",
    "Examples": [
      {
        "Example": "Lists all files, items and folders from recycle bin for site https://contoso.sharepoint.com/site",
        "Description": "m365 spo site recyclebinitem list --siteUrl https://contoso.sharepoint.com/site"
      },
      {
        "Example": "Lists only files from recycle bin for site https://contoso.sharepoint.com/site",
        "Description": "m365 spo site recyclebinitem list --siteUrl https://contoso.sharepoint.com/site --type files"
      }
    ]
  },
  {
    "Command": "m365 spo list webhook get",
    "Description": "Gets information about the specific webhook",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list is located.`-l, --listId [listId]`: ID of the list. Specify either `listTitle`, `listId` or `listUrl`.`-t, --listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId` or `listUrl`.`-i, --id <id>`: ID of the webhook.",
    "Examples": [
      {
        "Example": "Return information about a specific webhook which belongs to a list retrieved by ID in a specific site",
        "Description": "m365 spo list webhook get --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf --id cc27a922-8224-4296-90a5-ebbc54da2e85"
      },
      {
        "Example": "Return information about a specific webhook which belongs to a list retrieved by Title in a specific site",
        "Description": "m365 spo list webhook get --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle Documents --id cc27a922-8224-4296-90a5-ebbc54da2e85"
      },
      {
        "Example": "Return information about a specific webhook which belongs to a list retrieved by URL in a specific site",
        "Description": "m365 spo list webhook get --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl '/sites/project-x/Documents' --id cc27a922-8224-4296-90a5-ebbc54da2e85"
      }
    ]
  },
  {
    "Command": "m365 spo tenant site list",
    "Description": "Lists modern sites of the given type",
    "Options": "m365 spo site list",
    "Examples": [
      {
        "Example": "Using the --filter option you can specify which sites you want to retrieve. For example, to get sites with project in their URL, use Url -like 'project' as the filter.",
        "Description": "--filter"
      },
      {
        "Example": "Url -like 'project'",
        "Description": "When using the text output type, the command lists only the values of the Title, and Url properties of the site. When setting the output type to JSON, all available properties are included in the command output."
      },
      {
        "Example": "Title",
        "Description": "Url"
      },
      {
        "Example": "If you wish to list deleted sites in your tenant, you should use the command spo tenant recyclebinitem list",
        "Description": "To use this command you have to have permissions to access the tenant admin site."
      }
    ]
  },
  {
    "Command": "m365 spo roledefinition get",
    "Description": "Gets specified role definition from web",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site for which to retrieve the role definition.`-i, --id <id>`: The Id of the role definition to retrieve.",
    "Examples": [
      {
        "Example": "Retrieve the role definition for the given site",
        "Description": "m365 spo roledefinition get --webUrl https://contoso.sharepoint.com/sites/project-x --id 1"
      }
    ]
  },
  {
    "Command": "m365 spo tenant appcatalogurl get",
    "Description": "Gets the URL of the tenant app catalog",
    "Options": null,
    "Examples": [
      {
        "Example": "Get the URL of the tenant app catalog",
        "Description": "m365 spo tenant appcatalogurl get"
      }
    ]
  },
  {
    "Command": "m365 spo tenant site membership list",
    "Description": "Retrieves information about default site groups' membership",
    "Options": "`-u, --siteUrl <siteUrl>`: The URL of the site.`-r, --role [role]`: Filter the results to include only users with the specified roles: `Owner`, `Member`, or `Visitor`.",
    "Examples": [
      {
        "Example": "Retrieve information about default site groups' owners, members, and visitors of the site.",
        "Description": "m365 spo tenant site membership list --siteUrl https://contoso.sharepoint.com"
      },
      {
        "Example": "Retrieve information about site owners.",
        "Description": "m365 spo tenant site membership list --siteUrl https://contoso.sharepoint.com --role Owner"
      }
    ]
  },
  {
    "Command": "m365 spo storageentity get",
    "Description": "Get details for the specified tenant property",
    "Options": "`-k, --key <key>`: Name of the tenant property to retrieve",
    "Examples": [
      {
        "Example": "Show the value, description and comment of the AnalyticsId tenant property",
        "Description": "m365 spo storageentity get -k AnalyticsId"
      }
    ]
  },
  {
    "Command": "m365 spo list list",
    "Description": "Gets all lists within the specified site",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the lists to retrieve are located.`-p, --properties [properties]`: Comma-separated list of properties to retrieve. Will retrieve all properties if not specified.`--filter [filter]`: OData filter to use to query the lists with.",
    "Examples": [
      {
        "Example": "Return all lists located in in a specific site.",
        "Description": "m365 spo list list --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Return all lists located in in a specific site with specific properties.",
        "Description": "m365 spo list list --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"BaseTemplate,ParentWebUrl\""
      },
      {
        "Example": "Return all lists located in in a specific site with the Id, Title and ServerRelativeUrl properties.",
        "Description": "m365 spo list list --webUrl https://contoso.sharepoint.com/sites/project-x --properties \"Id,Title,RootFolder/ServerRelativeUrl\""
      },
      {
        "Example": "Return all lists located in in a specific site based on the given filter.",
        "Description": "m365 spo list list --webUrl https://contoso.sharepoint.com/sites/project-x --filter \"BaseTemplate eq 100\""
      }
    ]
  },
  {
    "Command": "m365 spo listitem attachment get",
    "Description": "Gets an attachment from a list item",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list item is located.`--listId [listId]`: ID of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId` or `listUrl`.`--listItemId <listItemId>`: The ID of the list item.`-n, --fileName <fileName>`: Name of the file to get.",
    "Examples": [
      {
        "Example": "Get an attachment from a list item by using list title.",
        "Description": "m365 spo listitem attachment get --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle \"Demo List\" --listItemId 147 --fileName \"File1.jpg\""
      },
      {
        "Example": "Get an attachment from a list item by using list URL.",
        "Description": "m365 spo listitem attachment get --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl \"/sites/project-x/Lists/DemoList\" --listItemId 147 --fileName \"File1.jpg\""
      }
    ]
  },
  {
    "Command": "m365 spo file list",
    "Description": "Gets all files within the specified folder and site",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the folder from which to retrieve files is located.`--folderUrl <folderUrl>`: The server- or site-relative decoded URL of the parent folder from which to retrieve files.`--fields [fields]`: Comma-separated list of fields to retrieve. Will retrieve all fields if not specified.`--filter [filter]`: OData filter to use to query the list of items with.`-r, --recursive`: Set to retrieve files from subfolders.",
    "Examples": [
      {
        "Example": "Return all files from a folder.",
        "Description": "m365 spo file list --webUrl https://contoso.sharepoint.com/sites/project-x --folderUrl 'Shared Documents'"
      },
      {
        "Example": "Return all files from a folder and all the sub-folders.",
        "Description": "m365 spo file list --webUrl https://contoso.sharepoint.com/sites/project-x --folderUrl 'Shared Documents' --recursive"
      },
      {
        "Example": "Return the files from a folder with specific fields which will be expanded.",
        "Description": "m365 spo file list --webUrl https://contoso.sharepoint.com/sites/project-x --folderUrl 'Shared Documents' --fields \"Title,Length\""
      },
      {
        "Example": "Return the files from a folder that meet the criteria of the filter with specific fields which will be expanded.",
        "Description": "m365 spo file list --webUrl https://contoso.sharepoint.com/sites/project-x --folderUrl 'Shared Documents' --fields ListItemAllFields/Id --filter \"Name eq 'document.docx'\""
      }
    ]
  },
  {
    "Command": "m365 spo app instance list",
    "Description": "Retrieve apps installed in a site",
    "Options": "`-u, --siteUrl <siteUrl>`: URL of the site collection to retrieve the apps for.",
    "Examples": [
      {
        "Example": "Return a list of installed apps on the specified site.",
        "Description": "m365 spo app instance list --siteUrl https://contoso.sharepoint.com/sites/site1"
      }
    ]
  },
  {
    "Command": "m365 spo site apppermission list",
    "Description": "Lists application permissions for a site",
    "Options": "`-u, --siteUrl <siteUrl>`: URL of the site collection to retrieve information for`-i, --appId [appId]`: Id of the application to filter by`-n, --appDisplayName [appDisplayName]`: Display name of the application to filter by",
    "Examples": [
      {
        "Example": "Return list of application permissions for the https://contoso.sharepoint.com/sites/project-x site collection.",
        "Description": "m365 spo site apppermission list --siteUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Return list of application permissions for the https://contoso.sharepoint.com/sites/project-x site collection and filter by an application called Foo",
        "Description": "m365 spo site apppermission list --siteUrl https://contoso.sharepoint.com/sites/project-x --appDisplayName Foo"
      }
    ]
  },
  {
    "Command": "m365 spo list view get",
    "Description": "Gets information about specific list view",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list is located.`--listId [listId]`: ID of the list where the view is located. Specify only one of `listTitle`, `listId` or `listUrl`.`--listTitle [listTitle]`: Title of the list where the view is located. Specify only one of `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or web-relative URL of the list where the view is located. Specify only one of `listTitle`, `listId` or `listUrl`.`--id [id]`: ID of the view to get. Specify `title` or `id` but not both.`--title [title]`: Title of the view to get. Specify `title` or `id` but not both.",
    "Examples": [
      {
        "Example": "Gets a list view by name from a list located in the specified site.",
        "Description": "m365 spo list view get --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle 'My List' --title 'All Items'"
      },
      {
        "Example": "Gets a list view by ID from a list located in the specified site.",
        "Description": "m365 spo list view get --webUrl https://contoso.sharepoint.com/sites/project-x --listUrl 'Lists/My List' --id 330f29c5-5c4c-465f-9f4b-7903020ae1ce"
      },
      {
        "Example": "Gets a list view by name from a list located in the specified site. Retrieve the list by its ID",
        "Description": "m365 spo list view get --webUrl https://contoso.sharepoint.com/sites/project-x --listId 330f29c5-5c4c-465f-9f4b-7903020ae1c1 --title 'All Items'"
      }
    ]
  },
  {
    "Command": "m365 spo file sharinglink list",
    "Description": "Lists all the sharing links of a specific file",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site where the file is located.`--fileUrl [fileUrl]`: The server- or site-relative decoded URL of the file. Specify either `fileUrl` or `fileId` but not both.`--fileId [fileId]`: The UniqueId (GUID) of the file. Specify either `fileUrl` or `fileId` but not both.`-s, --scope [scope]`: Filter the results to only sharing links of a given scope: `anonymous`, `users` or `organization`. By default all sharing links are listed.",
    "Examples": [
      {
        "Example": "List sharing links of a file by id.",
        "Description": "m365 spo file sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --fileId daebb04b-a773-4baa-b1d1-3625418e3234"
      },
      {
        "Example": "List sharing links of a file by url.",
        "Description": "m365 spo file sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --fileUrl \"/sites/demo/shared documents/document.docx\""
      },
      {
        "Example": "List anonymous sharing links of a file by url.",
        "Description": "m365 spo file sharinglink list --webUrl https://contoso.sharepoint.com/sites/demo --fileUrl \"/sites/demo/shared documents/document.docx\" --scope anonymous"
      }
    ]
  },
  {
    "Command": "m365 spo web clientsidewebpart list",
    "Description": "Lists available client-side web parts",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site for which to retrieve the information",
    "Examples": [
      {
        "Example": "Lists all the available client-side web parts for the specified site",
        "Description": "m365 spo web clientsidewebpart list --webUrl https://contoso.sharepoint.com"
      }
    ]
  },
  {
    "Command": "m365 spo hubsite list",
    "Description": "Lists hub sites in the current tenant",
    "Options": "`-i, --includeAssociatedSites`: Include the associated sites in the result (only in JSON output).",
    "Examples": [
      {
        "Example": "List hub sites in the current tenant",
        "Description": "m365 spo hubsite list"
      },
      {
        "Example": "List hub sites, including their associated sites, in the current tenant. Associated site info is only shown in JSON output.",
        "Description": "m365 spo hubsite list --includeAssociatedSites --output json"
      }
    ]
  },
  {
    "Command": "m365 spo page control list",
    "Description": "Lists controls on the specific modern page",
    "Options": "`-n, --pageName <pageName>`: Name of the page to list controls of.`-u, --webUrl <webUrl>`: URL of the site where the page to retrieve is located.",
    "Examples": [
      {
        "Example": "List controls on the modern page",
        "Description": "m365 spo page control list --webUrl https://contoso.sharepoint.com/sites/team-a --pageName home.aspx"
      }
    ]
  },
  {
    "Command": "m365 spo app list",
    "Description": "Lists apps from the specified app catalog",
    "Options": "`-s, --appCatalogScope [appCatalogScope]`: Target app catalog. Allowed values: `tenant`, `sitecollection`. Defaults to `tenant`.`-u, --appCatalogUrl [appCatalogUrl]`: URL of the tenant or site collection app catalog. It must be specified when the scope is `sitecollection`.",
    "Examples": [
      {
        "Example": "Return the list of available apps from the tenant app catalog. Show the installed version in the site if applicable.",
        "Description": "m365 spo app list"
      },
      {
        "Example": "Return the list of available apps from a site collection app catalog of the specified site.",
        "Description": "m365 spo app list --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1"
      }
    ]
  },
  {
    "Command": "m365 spo customaction get",
    "Description": "Gets information about a user custom action for site or site collection",
    "Options": "`-i, --id [id]`: ID of the user custom action to retrieve information for. Specify either `id`, `title` or `clientSideComponentId`.`-t, --title [title]`: Title of the user custom action to retrieve information for. Specify either `id`, `title` or `clientSideComponentId`.`-c, --clientSideComponentId [clientSideComponentId]`: clientSideComponentId of the user custom action to retrieve information for. Specify either `id`, `title` or `clientSideComponentId`.`-u, --webUrl <webUrl>`: Url of the site or site collection to retrieve the custom action from.`-s, --scope [scope]`: Scope of the custom action. Allowed values `Site`, `Web`, `All`. Default `All`.",
    "Examples": [
      {
        "Example": "Return details about the user custom action based on the id and a given url.",
        "Description": "m365 spo customaction get --id 058140e3-0e37-44fc-a1d3-79c487d371a3 --webUrl https://contoso.sharepoint.com/sites/test"
      },
      {
        "Example": "Return details about the user custom action based on the title and a given url.",
        "Description": "m365 spo customaction get --title \"YourAppCustomizer\" --webUrl https://contoso.sharepoint.com/sites/test"
      },
      {
        "Example": "Return details about the user custom action based on the clientSideComponentId and a given url.",
        "Description": "m365 spo customaction get --clientSideComponentId \"34a019f9-6198-4053-a3b6-fbdea9a107fd\" --webUrl https://contoso.sharepoint.com/sites/test"
      },
      {
        "Example": "Return details about the user custom action based on the id and a given url and the scope.",
        "Description": "m365 spo customaction get --id \"058140e3-0e37-44fc-a1d3-79c487d371a3\" --webUrl https://contoso.sharepoint.com/sites/test --scope Site"
      },
      {
        "Example": "m365 spo customaction get --id \"058140e3-0e37-44fc-a1d3-79c487d371a3\" --webUrl https://contoso.sharepoint.com/sites/test --scope Web",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo sitedesign run status get",
    "Description": "Gets information about the site scripts executed for the specified site design",
    "Options": "`-u, --webUrl <webUrl>`: The URL of the site for which to get the information`-i, --runId <runId>`: ID of the site design applied to the site as retrieved using `spo sitedesign run list`",
    "Examples": [
      {
        "Example": "List information about site scripts executed for the specified site design",
        "Description": "m365 spo sitedesign run status get --webUrl https://contoso.sharepoint.com/sites/team-a --runId b4411557-308b-4545-a3c4-55297d5cd8c8"
      }
    ]
  },
  {
    "Command": "m365 spo feature list",
    "Description": "Lists Features activated in the specified site or site collection",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site (collection) to retrieve the activated Features from`-s, --scope [scope]`: Scope of the Features to retrieve. Allowed values `Site,Web`. Default `Web`",
    "Examples": [
      {
        "Example": "Return details about Features activated in the specified site collection",
        "Description": "m365 spo feature list --webUrl https://contoso.sharepoint.com/sites/test --scope Site"
      },
      {
        "Example": "Return details about Features activated in the specified site",
        "Description": "m365 spo feature list --webUrl https://contoso.sharepoint.com/sites/test --scope Web"
      }
    ]
  },
  {
    "Command": "m365 spo list sitescript get",
    "Description": "Extracts a site script from a SharePoint list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site where the list to extract the site script from is located.`-l, --listId [listId]`: ID of the list to extract the site script from. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.`-t, --listTitle [listTitle]`: Title of the list to extract the site script from. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listId`, `listTitle`, or `listUrl` but not multiple.",
    "Examples": [
      {
        "Example": "Extract a site script from an existing SharePoint list with specified title located in the specified site.",
        "Description": "m365 spo list sitescript get --listTitle ContosoList --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Extract a site script from an existing SharePoint list with specified id located in the specified site.",
        "Description": "m365 spo list sitescript get --listId cc27a922-8224-4296-90a5-ebbc54da2e85 --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Extract a site script from an existing SharePoint list with specified server relative url located in the specified site.",
        "Description": "m365 spo list sitescript get --listUrl 'sites/project-x/Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Extract a site script from an existing SharePoint list with specified site-relative URL located in the specified site.",
        "Description": "m365 spo list sitescript get --listUrl 'Shared Documents' --webUrl https://contoso.sharepoint.com/sites/project-x"
      }
    ]
  },
  {
    "Command": "m365 spo serviceprincipal grant list",
    "Description": "Lists permissions granted to the service principal",
    "Options": "m365 spo sp grant list",
    "Examples": [
      {
        "Example": "To use this command you must be a Global administrator.",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo listitem list",
    "Description": "Gets a list of items from the specified list",
    "Options": "`-u, --webUrl <webUrl>`: URL of the site from which the item should be retrieved.`-i, --listId [listId]`: ID of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`-t, --listTitle [listTitle]`: Title of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`--listUrl [listUrl]`: Server- or site-relative URL of the list. Specify either `listTitle`, `listId`, or `listUrl` but not multiple.`-q, --camlQuery [camlQuery]`: CAML query to use to query the list of items with.`--fields [fields]`: Comma-separated list of fields to retrieve. Will retrieve all fields if not specified and json output is requested. Specify `camlQuery` or `fields` but not both.`-l, --filter [filter]`: OData filter to use to query the list of items with. Specify `camlQuery` or `filter` but not both.`-s, --pageSize [pageSize]`: Number of list items to return. Specify `camlQuery` or `pageSize` but not both. The default value is 5000.`-n, --pageNumber [pageNumber]`: Page number to return if `pageSize` is specified (first page is indexed as value of 0).",
    "Examples": [
      {
        "Example": "Get all items from a list named Demo List",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get all items from a list with ID 935c13a0-cc53-4103-8b48-c1d0828eaa7f",
        "Description": "m365 spo listitem list --listId 935c13a0-cc53-4103-8b48-c1d0828eaa7f --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "Get all items from list named Demo List. For each item, retrieve the value of the ID, Title and Modified fields",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --fields \"ID,Title,Modified\""
      },
      {
        "Example": "Get all items from list named Demo List. For each item, retrieve the value of the ID, Title, Modified fields, and the value of lookup field Company",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --fields \"ID,Title,Modified,Company/Title\""
      },
      {
        "Example": "From a list named Demo List get all items with title Demo list item using an OData filter",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --filter \"Title eq 'Demo list item'\""
      },
      {
        "Example": "From a list named Demo List get the first 100 items",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --pageSize 100 --pageNumber 0"
      },
      {
        "Example": "From a list named Demo List get the second batch of 10 items",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --pageSize 10 --pageNumber 1"
      },
      {
        "Example": "Get all items from a list by server-relative URL",
        "Description": "m365 spo listitem list --listUrl /sites/project-x/documents --webUrl https://contoso.sharepoint.com/sites/project-x"
      },
      {
        "Example": "From a list named Demo List get all items with title Demo list item using a CAML query",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --camlQuery \"<View><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>Demo list item</Value></Eq></Where></Query><RowLimit Paged='TRUE'>5000</RowLimit></View>\""
      },
      {
        "Example": "From a library named Demo Library with 5000+ files and folders, get all items recursively without running into a list view threshold exception, using a CAML query",
        "Description": "m365 spo listitem list --listTitle \"Demo List\" --webUrl https://contoso.sharepoint.com/sites/project-x --camlQuery \"<View Scope='RecursiveAll'><Query></Query><ViewFields><FieldRef Name='Title'/></ViewFields><RowLimit Paged='TRUE'>5000</RowLimit></View>\""
      }
    ]
  },
  {
    "Command": "m365 spo externaluser list",
    "Description": "Lists external users in the tenant",
    "Options": "`--filter [filter]`: Limits the results to only those users whose first name, last name or email address begins with the text in the string, using a case-insensitive comparison.`-p, --pageSize [pageSize]`: Specifies the maximum number of users to be returned in the collection. The value must be less than or equal to `50`.`-i, --position [position]`: Use to specify the zero-based index of the position in the sorted collection of the first result to be returned.`-s, --sortOrder [sortOrder]`: Specifies the sort results in Ascending or Descending order on the `SPOUser.Email` property should occur. Allowed values `asc|desc`. Default `asc`.`-u, --siteUrl [siteUrl]`: Specifies the site to retrieve external users for. If no site is specified, the external users for all sites are returned.",
    "Examples": [
      {
        "Example": "List all external users from the current tenant. Show the first batch of 50 users.",
        "Description": "m365 spo externaluser list --pageSize 50 --position 0"
      },
      {
        "Example": "List all external users from the current tenant whose first name, last name or email address begins with Vesa. Show the first batch of 50 users.",
        "Description": "Vesa"
      },
      {
        "Example": "m365 spo externaluser list --pageSize 50 --position 0 --filter Vesa",
        "Description": "List all external users from the specified site. Show the first batch of 50 users."
      },
      {
        "Example": "m365 spo externaluser list --pageSize 50 --position 0 --siteUrl https://contoso.sharepoint.com",
        "Description": "List all external users from the current tenant. Show the first batch of 50 users sorted descending by e-mail."
      },
      {
        "Example": "m365 spo externaluser list --pageSize 50 --position 0 --sortOrder desc",
        "Description": null
      }
    ]
  },
  {
    "Command": "m365 spo field get",
    "Description": "Retrieves information about the specified list- or site column",
    "Options": "`-u, --webUrl <webUrl>`: Absolute URL of the site where the field is located.`-l, --listTitle [listTitle]`: Title of the list where the field is located. Specify either `listTitle`, `listId` or `listUrl`.`--listId [listId]`: ID of the list where the field is located. Specify either `listTitle`, `listId` or `listUrl`.`--listUrl [listUrl]`: Server- or web-relative URL of the list where the field is located. Specify either `listTitle`, `listId` or `listUrl`.`-i, --id [id]`: The ID of the field to retrieve. Specify `id` or `title` but not both.`-t, --title [title]`: The display name (case-sensitive) of the field to retrieve. Specify `id` or `title` but not both.",
    "Examples": [
      {
        "Example": "Retrieves site column by id located in the specified site.",
        "Description": "m365 spo field get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --id 5ee2dd25-d941-455a-9bdb-7f2c54aed11b"
      },
      {
        "Example": "Retrieves list column by id located in the specified site. Retrieves the list by its title.",
        "Description": "m365 spo field get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listTitle Events --id 5ee2dd25-d941-455a-9bdb-7f2c54aed11b"
      },
      {
        "Example": "Retrieves list column by display name located in the specified site. Retrieves the list by its url.",
        "Description": "m365 spo field get --webUrl https://contoso.sharepoint.com/sites/contoso-sales --listUrl \"Lists/Events\" --title \"Title\""
      }
    ]
  },
  {
    "Command": "m365 spo hubsite get",
    "Description": "Gets information about the specified hub site",
    "Options": "`-i, --id [id]`: ID of the hub site. Specify either `id`, `title`, or `url` but not multiple.`-t, --title [title]`: Title of the hub site. Specify either `id`, `title`, or `url` but not multiple.`-u, --url [url]`: URL of the hub site. Specify either `id`, `title`, or `url` but not multiple.`--includeAssociatedSites`: Include the associated sites in the result (only in JSON output)",
    "Examples": [
      {
        "Example": "Get information about the hub site with specific ID.",
        "Description": "m365 spo hubsite get --id 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a"
      },
      {
        "Example": "Get information about the hub site with specific title.",
        "Description": "m365 spo hubsite get --title 'My Hub Site'"
      },
      {
        "Example": "Get information about the hub site with specific URL.",
        "Description": "m365 spo hubsite get --url 'https://contoso.sharepoint.com/sites/HubSite'"
      },
      {
        "Example": "Get information about the hub site with specific ID, including its associated sites. Associated site info is only shown in JSON output.",
        "Description": "m365 spo hubsite get --id 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a --includeAssociatedSites --output json"
      }
    ]
  },
  {
    "Command": "m365 spo get",
    "Description": "Gets the context URL for the root SharePoint site collection and SharePoint tenant admin site",
    "Options": null,
    "Examples": [
      {
        "Example": "Get the context URL for the root SharePoint site collection and SharePoint tenant admin site",
        "Description": "m365 spo get --output json"
      }
    ]
  },
  {
    "Command": "m365 spo sitescript get",
    "Description": "Gets information about the specified site script",
    "Options": "`-i, --id <id>`: Site script ID.`-c, --content`: Specify to only retrieve the content of the site script.",
    "Examples": [
      {
        "Example": "Get information about the site script with the specified ID.",
        "Description": "m365 spo sitescript get --id 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a"
      },
      {
        "Example": "Returns the site script contents:",
        "Description": "m365 spo sitescript get --id 2c1ba4c4-cd9b-4417-832f-92a34bc34b2a --content"
      }
    ]
  }
];
