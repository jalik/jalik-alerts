# Alert helper for Meteor

## Introduction

This package provides an easy way to display alerts on the client in Meteor.
You can also use it for other purposes on the server.

## Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:alerts
```

If later you want to remove the package :
```
meteor remove jalik:alerts
```

## How it works ?

You only need a single `AlertHelper` for each template instance to display one or more alerts at the same location.
All alerts are stored in a temporary `Mongo.Collection`, this means that alerts are not stored on disk and thus not persistent over app/browser restarts.
Because it uses a Mongo collection, it offers reactivity when an alert is added/removed/updated.
Each `AlertHelper` can handle several alerts.

## Creating an alert helper

You need to create an `AlertHelper` for each location where alerts should be displayed.
The best place to create it is in the `Template.onCreated()` method.

```js
import {AlertHelper} from 'meteor/jalik:alerts';

Template.loginForm.onCreated(function () {
    this.alerts = new AlertHelper();
});
```

## Clearing an alert helper

When the template is destroyed, you may want to remove related alerts to free memory.

```js
Template.loginForm.onDestroyed(function () {
    this.alerts.clear();
});
```

## Handling template's alerts

Below is an example of how you would handle errors in a template, removing and adding them at the right time.

```js
import {AlertHelper} from 'meteor/jalik:alerts';

Template.loginForm.onCreated(function () {
    this.errors = new AlertHelper();
});

Template.loginForm.events({
    'submit form': function (ev, tpl) {
        ev.preventDefault();
        let fields = getFields(ev.target);
        
        // Before login, clear previous errors
        tpl.errors.clear();

        // Login with username and password
        Meteor.loginWithPassword(fields.username, fields.password, function (err) {
            if (err) {
                // Add the error
                tpl.errors.addError(err);
                // or
                tpl.errors.addError(err.message);
                // or
                tpl.errors.add('error', err.message);
            }
        });
    }
});

Template.loginForm.helpers({
    errors: function () {
        // Returns errors for this template, argument is optional
        return Template.instance().errors.find({
            sort: {createdAt: -1}
        });
    }
});
```

## Displaying template's alerts

Finally, we display alerts in the template.

```html
<template name="loginForm">
   <form>
       {{#each errors}}
           <p class="alert alert-danger">{{createdAt}} : {{message}}</p>
       {{/each}}

       <div class="form-group">
           <label>{{t "Username or email"}}</label>
           <input class="form-control input-lg" name="username" type="text" required>
       </div>
       <div class="form-group">
           <label>{{t "Password"}}</label>
           <input class="form-control input-lg" name="password" type="password" required>
       </div>
       <div class="pull-right">
           <input class="btn btn-lg btn-success" type="submit" value="{{t "Log in"}}" disabled="{{loggingIn}}">
       </div>
   </form>
</template>
```

## Types of alert

Alerts have a type to categorize them in the collection, even if you are using only one `AlertHelper`,
you can display only selected types of alert by filtering on the `type` attribute.
By default there are 4 types of alert, `error`, `info`, `success` and `warning`, 
but you can "add" your own when calling `AlertHelper.add(type, message, extra)`, where `type` is your custom type.

```js
import {AlertHelper} from 'meteor/jalik:alerts';

Template.notifications.onCreated(function () {
    this.alerts = new AlertHelper();
    this.alerts.add('notification', "This is a notification");
    this.alerts.add('error', "This is an error");
});

Template.notifications.helpers({
    errors: function () {
        return Template.instance().errors.find({type:'errors', sort: {createdAt: -1}});
    },
    notifications: function () {
        return Template.instance().alerts.find({type:'notification', sort: {createdAt: -1}});
    }
});
```


```html
<template name="notifications">
   <div>
       <h4>ERRORS:</h4>
       {{#each errors}}
           <p class="alert alert-danger">{{createdAt}} : {{message}}</p>
       {{/each}}
       
       <h4>NOTIFICATIONS:</h4>
       {{#each notifications}}
           <p class="alert alert-notification">{{createdAt}} : {{message}}</p>
       {{/each}}
   </div>
</template>
```

## Accessing the collection

To get the collection, just import it.

```js
import {Alerts} from 'meteor:jalik:alerts';
Alerts.find({}, {sort:{createdAt: -1}});
```
