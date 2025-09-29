# Project 01 Retrospective and overview


[Github Repo](https://github.com/Strawberry64/playlist-generator)

## Overview
This is a Spotify Playlist generator, it gets info using the Spotify API and it reads and writes user data.
[here](https://github.com/public-apis/public-apis?tab=readme-ov-file).

We got styling help for this document from [this guide](https://github.com/Strawberry64/playlist-generator/blob/main/README.md)

## Introduction

* How was communication managed
Communication was primarily done over Slack. 
* How many stories/issues were initially considered
There were 17 issues at the start of the project.
* How many stories/issues were completed
There were a total of 27 issues. 21 Were completed through the course of the project. Everyone surpassed the minimum amount of issues resolved.

## Team Retrospective

### Alexangelo Orozco Gutierrez
1. Alexangelo's pull requests are [here](https://github.com/Strawberry64/playlist-generator/issues?q=is%3Aclosed%20is%3Apr%20author%3AStrawberry64)
1. Alexangelo's Github issues are [here](https://github.com/Strawberry64/playlist-generator/issues?q=is%3Aclosed%20assignee%3AStrawberry64)

#### What was your role / which stories did you work on
Most of my work was focused on the front end making the navigation easier, explaining to other how the routing works, and using database calls to populate an area of the app where user playlists are shown, including a drop down menu for songs.

+ What was the biggest challenge? 
  + Getting that App to work consistently with everyone, mostly on Signing in and routing into proper views.
+ Why was it a challenge?
  + The log in process was changed several times. It was not the most organized and there was a lot of reformatting code that did work in order for it to work in a certain sequence.
  + How was the challenge addressed?
  + Most of the work was making sure the Spotify API was working correctly with the URIs and also with the help of the internet and AI tools to check for bugs.
+ Favorite / most interesting part of this project
  + Working with teammates who make very accessible code to advance on my own specific issues. It isn’t always the way to do things but it is beautiful.
+ If you could do it over, what would you change?
  + I would make sure that things are planned out more in order to avoid extra work.
+ What is the most valuable thing you learned?
  + Do work consistently and keep things simple.

### Daniel Solano
#Most Recent - Latest PR'a
https://github.com/Strawberry64/playlist-generator/pull/47, https://github.com/Strawberry64/playlist-generator/pull/43, https://github.com/Strawberry64/playlist-generator/pull/34,
https://github.com/Strawberry64/playlist-generator/pull/27, 
https://github.com/Strawberry64/playlist-generator/pull/21

#Most Recent - Latest Issues
https://github.com/Strawberry64/playlist-generator/issues/35,
https://github.com/Strawberry64/playlist-generator/issues/7,
https://github.com/Strawberry64/playlist-generator/issues/6,
https://github.com/Strawberry64/playlist-generator/issues/5,
https://github.com/Strawberry64/playlist-generator/issues/3



#### What was your role / which stories did you work on
+ I worked mainly on the database functionality: initializing it and populating it when users sign in.
+ I also contributed to unit tests, added two loading pages (sign-in loading + logging-out                                                 
+ loading), and got the logout button working when others were stuck.
+ I created a “logging out” page to clear user info and redirect properly.
+ I reviewed a lot of changes, tested them, and made sure they worked before merging to main.

What was the biggest challenge?
+ My biggest challenge was figuring out why my code wasn’t working in main when it worked fine locally.
Why was it a challenge?

+ It turned out that routes had been changed, so my page was being skipped. It took a long time + to discover that was the cause. Later, I also ran into problems redirecting from inside (tabs) — + no matter what I tried, it wouldn’t reroute properly.

How was the challenge addressed?
+ After carefully debugging, I found the routing issue and fixed it. For the (tabs) redirect, I created an extra route that solved the problem and made the logout flow smooth.

Favorite / most interesting part of this project
+ Building and populating the database for the first time.
+ Fixing other people’s errors — I actually really enjoyed debugging and making sure the app + + worked smoothly.

If you could do it over, what would you change?
+ I’d be more careful about tracking route changes early on so I didn’t lose so much time + debugging something outside my code.

What is the most valuable thing you learned?
+ How to use GitHub more effectively — especially handling merge conflicts and reviewing pull + requests with VS Code.

### Carlos Guizar
1. Carlos's pull requests are [here](https://github.com/Strawberry64/playlist-generator/issues?q=is%3Aclosed%20assignee%3ABarl0s4)
1. Carlos's Github issues are [here](https://github.com/Strawberry64/playlist-generator/issues?q=is%3Aclosed%20is%3Apr%20author%3ABarl0s4)

#### What was your role / which stories did you work on
Most of it was working with Spotify API and getting things related to it working. Also Log in functionality and getting JSON requests into usable data. Also making the generator part, the big vision of the project.

+ What was the biggest challenge? 
  + Getting Spotify API to work with everyone, getting data converted properly
+ Why was it a challenge?
  + URIs needed to be added, getting data required going through JSON variables and getting specific information out.
  + How was the challenge addressed?
  + Prior knowledge and help from the internet.
+ Favorite / most interesting part of this project
  + Getting Spotify User data to appear.
+ If you could do it over, what would you change?
  + Making the generator work with other pieces of data.
+ What is the most valuable thing you learned?
  + How to use APIs in Expo projects.

### Lucy Blanco
1. Lucy’s pull requests are [here](https://github.com/Strawberry64/playlist-generator/pulls?q=is%3Apr+is%3Aclosed+author%3Alucybz)
1. Lucy’s Github issues are [here](https://github.com/Strawberry64/playlist-generator/issues?q=is%3Aissue%20state%3Aclosed%20author%3Alucybz) 

#### What was your role / which stories did you work on
I worked on the front end of the application. I worked on establishing a style, button functionalities, and displaying user information from the api. I also created unit tests for the data base.

+ What was the biggest challenge? 
  + The biggest challenge was making the log out button work. It seemed like nothing was working no matter what rerouting command I was using.
+ Why was it a challenge?
  + A fear of mine was messing up any api implementations, and I did end up messing up some database implementations in the files that I was working on. 
  + How was the challenge addressed?
  + After what seemed like hours of trying to figure out how to reroute I ended up asking my team members for help and Daniel was able to get the log out button to work and redirect to the initial index.
+ Favorite / most interesting part of this project
  + My favorite part of the project was styling and making the app look like a Spotify inspired playlist app.
+ If you could do it over, what would you change?
  + I would further inquire on the api authorization requirements. At first I was only able to access the api on campus because I had listed the school’s address and not my home ip address. 
+ What is the most valuable thing you learned?
  + I’ve learned to communicate more properly with other team members on what we’re working on and how to merge what we have.



## Conclusion

- How successful was the project?
  - It reached the Minimum Viable Product. There probably is some more things that could have been done. But we did a very good job and things are very nice looking and works well for such an intense project.
- What was the largest victory?
Getting the Database and Generator Working properly.
- Final assessment of the project
Overall, a great project, lots of learning and mistakes along the way but very productive and high morale across the team for the final result of this project.


