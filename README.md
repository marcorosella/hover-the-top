Hover the top!
=============

A simple clickless interface for the Leapmotion JavaScript framework, LeapJS (http://js.leapmotion.com). It lets open and close modal windows hovering on elements displaying a SVG timer.
 

How it works
-------------------------
Call the script at the onload of the page:
```
hoverTheTop.init();

```
Add a "clickless" class , the id of the modal window you want to interact to and the action to the desired clickless element:

```
<div id="openhelp" class="clickless" data-dest="modal-one" data-action="open">Open Me</div>
```

Demo
-------------------------
http://marcorosella.com/lab/hoverthetop/