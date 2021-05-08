module.exports = {
  siteMetadata: {
    title: `Alex != Geek();`,
    description: `I am a Sitecore Architect. Father of Luuk, fiancé of Marloes, hoarder of electronics. Loves to learn something new every single day.`,
    author: `Alex van Wolferen`,
    siteUrl: `https://www.alexvanwolferen.nl`,
    social: {
      twitter: `avwolferen`,
      facebook: ``,
      github: `avwolferen`,
      linkedin: `alexvanwolferen`,
      email: `alexvanwolferen@gmail.com`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 970,
	      withWebp: true,
	      withAvif: true,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `warn`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `files`,
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
          `gatsby-remark-prismjs`,
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    // uncomment this and input the trackingId to enable google analytics
    {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
    trackingId: `UA-77698879-3`,
    },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Alex != Geek();`,
        short_name: `Alex != Geek();`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./static/alex-icon.png`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
  ],
}
