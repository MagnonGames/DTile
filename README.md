# DTile - The tilemap editor for everyone
[![Build Status](https://travis-ci.org/MagnonGames/DTile.svg?branch=master)](https://travis-ci.org/MagnonGames/DTile)
[![dependencies Status](https://david-dm.org/MagnonGames/DTile/status.svg)](https://david-dm.org/MagnonGames/DTile)
[![devDependencies Status](https://david-dm.org/MagnonGames/DTile/dev-status.svg)](https://david-dm.org/MagnonGames/DTile?type=dev)

DTile aims to be the best tilemap editor available today. It runs in your browser
(right now only Chrome) and has the ability to adapt to what you need it to do.
If you're making a complete game with it, you can make your own custom game
plugin that allows you to have all the options you need right at your fingertips
or if you just want to show off a cool tileset you made, DTile is already
configured with all the essentials out of the box.

## DTile is in Alpha
DTile is using some of the latest cutting edge features of the web-platform
and is only functional in Chrome right now. It's also not super stable, though
you can certainly play around with it or even use it for a game if your feeling
daring.

## Contributing
We want to make contributing to DTile as easy and frictionless as possible. If
you want to help out, but you have something you're unsure about, send an email
to [hello@dtile.io](mailto:hello@dtile.io) and someone (most likely @magnonellie) will help you
out! We don't bite and you can help out no matter what your skillset is. You
don't have to be able to code to make a good contribution!

If you want to add a new feature, a good idea is to open an issue first before
starting to write code to see if others may have valuable feedback.

## Developing

### Requirements
- Git, NPM and Bower installed

### Getting started
First of all, the usual JavaScript gobble applies with the catch that DTile
still uses bower, meaning that you have to fetch all bower dependencies too.
(This is subject to change very soon as Polymer 3.0 comes around)

```
$ cd path/to/DTile
$ npm i && bower i
```

With that done, you need to download the
[Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli) if you
don't already have it installed. Then, execute `polymer serve` and open one of
the links presented by the serve command and you're done! Do keep in mind that
Google Chrome is currently the only browser that can handle this development
setup for now.
