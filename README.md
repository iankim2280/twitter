# Assignment1

## Complete a twitter page with some codes from exercises and labs we've covered.

```javascript
function getData() {
  tweets = JSON.parse(localStorage.getItem("twitter"));
  if (tweets == null || tweets.length == 0) {
    tweets = [];
  }
  render();
}
```
