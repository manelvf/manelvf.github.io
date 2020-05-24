Hi, again.

It has been a while since my last post, but I think now is the perfect timing for resuming my blogging. There are quite a few news, apart from a global pandemy,but the most important one right now is that I decided to migrate my blog to this new eye-bleeding format.

## Old static generator went deprecated

As [Hubpress project](https://hubpress.github.io) is no longer mantained, I decided to migrate to [Metalsmith](https://metalsmith.io) for a few reasons. The most important, is the easyest one I found, as it uses a nice chained methods pattern that allows you to add your own plugins. Even is not as popular as Jekyll or Gatsby, it's still very broadly used. And worst case, I can migrate again, which I hope I don't need in another 5 years.

I chose Hubpress five years ago as something interemediate between the old CMS-way (like Wordpress) and the "new" static way of building websites. It's lifecycle has ended. It's probably the blogging system I have used more, so it wasn't so bad. It had to main problems: it used React and it was coupled to Github. I wanted to remove those two dependencies with the new system.

## The migration

When choosing a static website generator, most people opt for the widely used Jekyll or Gatsby, which has a company behind. Both are good options, as there are others interesting too, like Hugo. But I wanted something simple that I could fully control and understand. I chose Metalsmith as it's made for being essentially simple, uses Javascript, so it's ubiquitous and doesn't need a fancy frontend renderer for it. It seems that is not so popular (you can check the StaticGen website for it), but it seems to have more that one maintainer and does what you wnt from it, which is essentially expanding templates in text files. Something really simple that can become really complex.

Most of the content was already there, I only had to add support for both old (asciidoc) and new posts (markdown) and adding a few plugins (feed generator, collections and a few minor stuff). The only tricky part is retrieving metadata from the filename, as I wanted to keep the old convention, which comes from Jekyll and it's widely adopted for static generated blogs: <date>-<blog post title>.<format>.

As everything in *Metalsmith* is a plugin, I found the permalinks one very compelling and easy to use. Be careful with upper-case paths, as they are usually recognized by the local server but not for a production web server. Check also te output folder: don't use the root folder as output in conjuncton wth the clear command, or it will erase entirely your local folder. Overall, remember to commit everything to versin control, apart rom dependencies, etc... I commit the outputoo, as Github Pages only supports buils for Jekyll. There are more evolved systems such as Netifly or Surge with better support, and being static, it's easy to switch to one of them. I hope we have more static hosting options inthe future.

Furthermore, I added some layout template with some styling. I am not satisfyed, so I will go back to that in the future, even now is probably good enough. Another new addition, a subscription box courtesy of Mailchimp, in case some of you want to receive updates by email.

It took me longer than expected to migrate to the new system, but I'm satisfyed with the new system, as I feel that I understand every single step and I can mess with it when I need to. Sometimes maintainability is not about having long-term duration components, but about being able to easily replace those components when it's required, or necessary.

## New domain

I decided to use this [Manel.pro](https://manel.pro) domain, which started as a joke, but as big corporations are becoming evil and evil, I think it's worth enough keep using it. I regret a bit discarding my old manelvf.com, but this sounds better. Blog contents are still hosted in Github, but eventually can be moved to any hosting. That is one of the best things about static generators.

I will keep blogging from time to time here, and probably I will add Galician and Spanish content, not necessarily technical.

