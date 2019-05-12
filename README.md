<h1 align="center">
  <img src="https://github.com/NivM1/StremioPodcust/blob/master/resources/images/addon_logo.png" alt="Podcast For All" width="150"></a>
  <br>
  Podcasts For All
  <br>
</h1> 

<h4 align="center">Stream the Best Podcasts Listening Experience to <a href="https://www.stremio.com/" target="_blank">Stremio</a></h4>

<p align="center">
  <a href="https://paypal.me/doron050">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>

<p align="center">
  • <a href="#Our-Vision">Our Vision</a> 
  • <a href="#Key-Features">Key Features</a>
  • <a href="#How-to-Use">How to Use</a>
   • <a href="#Support-and-Contact">Contact</a>
  • <a href="#Setup-for-Development">Setup for Dev</a>
  • <a href="https://www.stremio.com/competition">Add-On Master</a>
  • <a href="https://www.stremio.com/addon-sdk">Stremio add-on SDK</a>
  
</p>

> *Podcasts For All* - `have fun`, `be smart`.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)

> **We are making our best efforts** to bring you the best podcasts resources.<br/>
> If you like our addon, you can help us by <a href="https://paypal.me/doron050">donate and become a backer</a>.

## Our Vision
> Deliver the **_best listening experience_** to the **_most verstile & high-quality_** podcasts<br/>right to your daily use media platform - Stremio

## Key Features

* Best podcasts worldwide (smart filters and ordering) :trophy:
  * All genres & types
  * All languages & regions :european_castle: :tokyo_tower:
* Podcast catalogs: :file_folder:
  * Top Podcasts
  * By Genres
  * By Country
  * Felling Luckey - Random podcast
* Search for podcasts :mag:
* Extra details :bookmark:
  * Podcast length
  * Podcast website
  * Social Platforms refrences (Facebook, Spotify and more)
* Stream HQ audio right to your device :headphones:
  * Cast the podcast to available devices
* Powered by LISTEN NOTES API

#### Screenshot - Main Podcasts Catalog:
![Podcasts Catalog](https://github.com/NivM1/podcasts-for-all/blob/master/resources/images/podcast_for_all_screen.jpg)

#### Screenshot - Select Episode:
![Podcasts Epidsodes](https://github.com/NivM1/podcasts-for-all/blob/master/resources/images/podcast_for_all_screen2.jpg)

## How to Use
* Open your Stremio client :computer::iphone:
* Go to `addons` (usually it's up there :arrow_upper_right:)
* Copy our addon url <http://podcasts-for-all.ga> and paste it on `Add-On Repository Url`
* Now go back :arrow_backward: and then go to `Discover` :telescope:
* Our top podcasts are under the `Podcasts` catalog
* You can now filter your podcasts by `Genre` or `Country` (Each one represented as sub-catalog) :performing_arts:
* If you like to take risks - Try out our `FeelingLucky` catalog (who knows, maybe you will find your one) :roller_coaster:
* You can also `Search` for specific podcast using the search field above :arrow_up::mag_right:
* Inside each `podcast` page you will find:
  * alot of details about the podcast and the contant
  * All the avialable `Episodes` of the selected podcast
* When you select an `Episode` you can:
  * Stream the episode right to your stremio
  * Go to the `podcast website`
  * Get the `podcast RSS`
  * Get to know your podcast via his `social network accounts`
* Now you are ready to go by yourself. Enjoy! :tada:
> We hope you have _the great Podcast Listening Experience of your life!_ :rainbow:

## Setup for Development

* Go to <a href="https://www.listennotes.com/api/">Listen Notes API</a> :page_facing_up:
* Create new **_account_** and save your **_API_KEY_** :memo:
* Now it's time for some preperation
```bash 
# Clone this repository
$ https://github.com/NivM1/podcasts-for-all.git

# Go into the repository
$ cd podcasts-for-all

# Install dependencies
$ npm install
```
* Set your `.env` file like that:
```diff
+# VERSION= [Addon Version]
+# PODCASTS_API_KEY= [Listen Notes API KEY]
+# LOG_LEVEL= [Logger level- such as: trace, debug, error...]
```

* Run your addon local server using `npm start`
* Install it on your StremIO app (web / desktop) :computer:
  * The addon will be available here: <http://127.0.0.1:56960/manifest.json>
* Now go to <https://staging.strem.io/#/discover/Podcasts> and **enjoy your contribution to this great addon!** :trumpet:


### Support and Contact
------

**Podcast For All** © 2019+, DE, NM Released under the [MIT License].<br>
Authored and maintained by DE, NM. with help from contributors.


> GitHub [@Niv M](https://github.com/nivm1) <br/>
> GitHub [@Doron Eli](https://github.com/doron050) <br/>
> Contact us via mail: <podcasts_for_all@yahoo.com>

[MIT License]: http://mit-license.org/
