#LDL Prototype
This is a "proof of concept" for a simple table of data displaying LDL data.  It provides minimal search capabilities, and does not currently work with a backend.  It simulates this through fixture data, which is built from an Excel Worksheet.

This application should work as a single page application, but as there's only one "view" it doesn't do much yet.

##Areas of interest
`index.html` - This is the root of the application.  It should be pretty easy to punch up.

`app.js` - This is just the root JS file.  It does some shimming to make things work better in ember.

`data\converter.js` - This is a very small node script.  It requires some set up, as you will need the packages for `xlsx` and `underscore`.  Once you have that, its a fairly simple process of renaming the .xlsx file to data.xlsx.  With that in place, it will create new copies of the `*.json` files.

`data\*.json` - This is the fixture data

`app\views` - All of the view classes can be found here.

`app\models` - All of the model classes can be found here.




##Developer Notes:
- Started with ember.js and had extreme problems with the data size.  With even a minimal amount of actual data in each dataset, ember was crashing Firefox regularly.  Spent a bit too much time discovering that.
- The converter is building a relational dataset, but it still lacks basic RESTful concepts.  You cannot, for instance go to `data/shipment/1` and just get record 1.  I could have dumped it so that there was a file for each, but it would have been a pain to set up.  I have elected to just work with what I have right now.

- TODOS
* *comments* I usually like to do more commenting.  This is not the state of a repo I like to call “master"
* *tests* Given a more solid time frame, I’d have put in tests as I go.  I’m faster if I don’t do test driven development, so I skipped it for now.
* *organization* I skimped on the organizational structure.  Some clean up would have libraries such as backbone and require living in their own directory structures.  It was easier to have everything at the root level to start.  I also did a blanket `git add .` operation which leads to some files being checked in that should have been ignored.  At some point a good `.gitignore` would save the number of files that come with this. 
* *filters* There is a lot of excessive JS filtering to simualte the filter that would naturally be part of a REST API, and although regex matching is pretty fast, loading an entire table of data first to do it, is too slow.
* *cache* No caching of data is present, as this reflects the nature of a live updating application.  That said, by not caching we are passing around 4MB files, which is pretty intense for just "data".
* *bower* I find bower to be frustrating when setting up a quick environment, which is exactly the opposite of how bower should work.  But using bower for package management is ultimately something that should happen here, because there is no good reason to have a local copy of jQuery.
* *browser support* I haven't tested this in IE, I have a limited network and left my laptop with IE on it at home.  So I can't make any promises.
* *CSS* There is very little CSS in place.  I didn't want to commit to a framework at this time.  
* *Responsive Support* Some of this should work fine, but on smaller phone screens I need to do some rejiggering of the CSS.  Shouldn't be too hard to do, just needs to be done.
* *branding* There is very little time spent trying to mirror the loaddelivered website.  I'm not exactly sure we want to do that close a CSS match, although it is certainly possible.  