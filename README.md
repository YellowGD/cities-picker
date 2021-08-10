# Cities Picker

## Table of contents

- [Presentation](#presentation)
- [Running the app](#running-the-app)
- [UX improvements](#ux-improvements)
  * [Mechanism of listing, searching and picking cities](#mechanism-of-listing-searching-and-picking-cities)
  * [Provide the user the right information](#provide-the-user-the-right-information)
  * [Error handling](#error-handling)

## Presentation

Cities Picker is an app for searching cities of the world and picking up the favourites ones.

![Presentation](/images/presentation.png)

It is based on the requirements and low-fidelity mockup provided in
[Front End Challenge](https://docs.google.com/document/d/1nmz8BuMGjVU1YwsQhjHYZCsg-By_6DVFwKLpclWAgsA/edit#heading=h.e5p518s3y0oj)

## Running the app

Run `npm intall` for installing dependencies and then `npm start` for a dev server. Navigate to `http://localhost:4200/`.

***NOTE:** the BE API needs to be running*

If you are interested in running the unit test just run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## UX improvements

The proposed UI by the challenge has some user experience issues that this implementation try to fix.

### Mechanism of listing, searching and picking cities

**Original mocks**

The original mocks show a fixed box that looks like it is containing all the cities of the world. However, it is not showing any scrollbar that could be useful for accessing the non-visible results.

When the user performs a search, the box keeps the same size producing useless empty space.

When results appear, every item has a kind of checkbox that could suggest that if we click on it, we are selecting the city. However, this is not the standard expected behaviour because in components like typeaheads the way of selecting is simply by clicking on the item.

If users need to remove a preferred city and the city is not in the box (because another search was performed) they need to search back to access the checkbox.

**Current implementation**

This implementation tries to solve all above issues providing a mechanism of typeahead kind search.

The cities are not all loaded into the component but they are brought on demand as the user begins the search.<br/>
![Main - empty](/images/main-empty.png)
![Main - results](/images/main-results.png)

For selecting the city the user needs just to click on the item.

The selected items are added to the list of preferred cities in Preferred cities section.<br />
![Main - selecting](/images/main-selecting.png)

The last results are kept available and are shown when the input gets focus again. A favourite icon is shown to let the user know that city was previously selected.<br />
![Main - last results](/images/main-last-results.png)

For removing items users don't need to use the Cities search we just click on the X icon in the city.

To avoid bringing a heavy load of data, the results are limited to ten items per search. The user is able of using a scroll bar to view all the results. If there are more than ten available items, a results info section will appear and so by clicking on the "View more" button more results will be brought.<br />
![Main - view more](/images/main-view-more.png)

### Provide the user the right information

The original mocks have a lack of information about how to use the app and about what is happening in every moment.

This implementation tries to solve that issue providing information to the user depending of the status of the app.

**Preferred cities**

When the user loads the app, a message appears informing that the app is looking for the saved preferred cities:<br/>
![Info - preferred cities - loading](/images/info-preferred-cities-loading.png)

After searching for preferred cities, if there aren't saved cities, a message appears indicating this situation and fomenting the selection of cities:<br/>
![Info - preferred cities - no results](/images/info-preferred-cities-no-results.png)

After searching for preferred cities, if there are saved cities, a message appears to foment the user to add more cities and to indicate how to remove them:<br/>
![Info - preferred cities - add more](/images/info-preferred-cities-add-more.png)

**Cities search**

When the user is not performing any search, a message appears to foment the user the searching for cities:<br/>
![Info - cities search - search](/images/info-cities-search-search.png)

When the user performed a search, a message appears indicating the search is in progress:<br/>
![Info - cities search - searching](/images/info-cities-search-searching.png)

When the search is completed, if there aren't results matching with the user input, a message appears indicating this situation:<br/>
![Info - cities search - no results](/images/info-cities-search-no-results.png)

### Error handling

The original mocks don't present any mechanism about how to let the user know when something went wrong in the app (very frequent situation because of the state of the API).

This implementation tries to solve that issue providing information to the user using small popups.

Every popup contains three elements: a description about the context of the problem, the error message (that supports messages from the server or the UI), and a recommended action to the user.

**Getting the preferred cities**

![Error - preferred cities - getting](/images/error-getting-general.png)<br />
![Error - preferred cities - getting](/images/error-getting-missing.png)

**Searching the preferred cities**

![Error - preferred cities - getting](/images/error-searching.png)

**Saving the preferred cities**

![Error - preferred cities - saving](/images/error-saving.png)