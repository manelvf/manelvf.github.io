const Metalsmith = require("metalsmith")
const asciidoctor = require("metalsmith-asciidoctor")
const collections = require("metalsmith-collections")
const permalinks = require("metalsmith-permalinks")
const markdown = require("metalsmith-markdown")
const dateInFilename = require('metalsmith-date-in-filename')
const debug = require('metalsmith-debug')
const inPlace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')
const watch = require('metalsmith-watch')
const Handlebars = require('handlebars')
const each = require('metalsmith-each')
const feed = require('metalsmith-feed')
const asset = require('metalsmith-static')


Handlebars.registerHelper("toISOString", (aDate) => {
  return aDate? aDate.toISOString().slice(0,10) : 'unknown'
})

Handlebars.registerHelper("formatTitle", (title) => {
  return title.replace(/ /g, '-').toLowerCase()
})


Metalsmith(__dirname)
  .source('_posts')
  .destination('blog')
  .clean(true)
  .use(asset({
      src: 'dist',
      dest: 'dist'
  }))
  .metadata({
        author: 'Manel Vilar',
        site: { 
          url: 'https://manel.pro/blog'
        }
    })
  .use(dateInFilename(true))
  .use(each((file, filename) => {
    file.title = file.title || filename.substr(10)
      .replace(/-/g, ' ')
      .replace('.gal', '')
      .replace('.md', '')
      .replace('.adoc', '')
  }))
  .use(
    collections({
        articles: { 
          pattern: ['**/*.adoc','**/*.md'],
          reverse: true,
          sortBy: 'date'
        },
        index: '**/*.hbs'
      })
  )
  .use(inPlace())
  .use(asciidoctor({
    pattern: "*.adoc",
  }))
  .use(markdown({
    pattern: "*.md",
  }))
  .use(layouts({
      "default": "default.hbs"
  }))
  .use(permalinks({
    // original options would act as the keys of a `default` linkset,
    pattern: 'posts/:date-:title',
    date: 'YYYY-MM-DD'
  }))
  .use(feed({collection: 'articles'}))
  .use(debug())
  .build(function(err) {
    if (err) throw err;
  })

