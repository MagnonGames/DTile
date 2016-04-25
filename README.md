# DTile - The simple, non-clutter tilemap editor
DTile aims to be the best tilemap editor available today. It runs in the browser so that virtually any machine can run it. It uses some of the latest web technologies such as WebGL (with Pixi.js) combined with React.

## Why another tilemap editor? Isn't Tiled enough?
Tiled is a great program with a lot of features and we're absolutely not saying that you can't create great games with it. However, where it's lacking is in terms of ease-of-use. Tiled has a lot of features which makes it capable of doing a lot of things such as different types of maps and a lot of other things, but that takes a pretty huge hit on usability. What DTile aims to do is to strip out all of the unnecessary features and provide you with a great out-of-the-box experience while still allowing for expandability with plugins (again, coming... Well, later).

## Using DTile
DTile is NOT ready for production in any kind of way at all. It's currently very much in development and the master branch can not be considered stable. If you're not planning on contributing to DTile then you should probably wait a while until we're done with a relatively stable version at least.

## Contributing
Feel free to contribute! We appreciate any kind of help, be it bug reports or pull requests!

Planned features can be found on our trello board which you can find here: <https://trello.com/b/wjNJgZiS/dtile>.
GitHub issues is used for bug tracking and user feature request while trello is used for more "officially" planned features. Feel free to leave a comment on trello or GitHub issues if you have any input.

### Quick-start Guide
1. Download and install node (<https://nodejs.org/en/download/package-manager/>)
2. Execute these commands:
```
$ git clone https://github.com/theMagnon/DTile.git
$ cd DTile/
$ npm install
$ npm run build
$ npm start
```
3. Visit <http://localhost:8080>
4. `ctrl + c` when you're done (in the terminal of course)

If you for some reason would like to only build a specific part of DTile, you can use the following syntax: `npm run build -- <js|css|html|images|icons>`

To run with watch so that it automatically updates when you change code, just run `npm run dev`.

## License
MIT - Basically you can do whatever you want with it as long as you credit us for making it originally.
