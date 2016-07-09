# react-native-jelly-side-menu
A side menu that animates like a jelly! iOS & Android tested.

[![npm version](https://badge.fury.io/js/react-native-jelly-side-menu.svg)](http://badge.fury.io/js/react-native)
[![NPM](https://nodei.co/npm/react-native-jelly-side-menu.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-native-jelly-side-menu/)

## Demo Showcase (Youtube link) The video seems stuck at 2.5s when not using Chrome to watch. I will fix it when I have time.
[https://www.youtube.com/watch?v=lvyJX2-l8pM](https://www.youtube.com/watch?v=lvyJX2-l8pM)
## 
[![Demo Showcase](https://img.youtube.com/vi/lvyJX2-l8pM/0.jpg)](https://www.youtube.com/watch?v=lvyJX2-l8pM)
##
<img src="http://i.imgur.com/gD7kFvi.gif" alt="Demo Showcase" width=200 height=300 style="width: 200px; height: 300px; max-width: auto;"/>


## Prerequisites
React Native 0.25 or higher

## Installation
```shell
npm i react-native-jelly-side-menu --save
rnpm link
```

## Usage
```js
import { JellySideMenu } from 'react-native-jelly-side-menu'
```

### Toggle
```js
toggleSideMenu()
```

### Open
```js
toggleSideMenu(true)
```

### Close
```js
toggleSideMenu(false)
```


### Example
```js
class JellySideMenuPage extends Component {

  constructor(props) {
    super(props);
    this.itemStyle = {padding: 16, backgroundColor: 'transparent'};
    this.itemTextStyle = {color: '#000000', fontWeight: 'bold', fontSize: 20};
    this.renderMenu = this.renderMenu.bind(this);
  }

  renderItem(text, onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={this.itemStyle}>
          <Text style={this.itemTextStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderMenu() {
    return (
      <View>
        {this.renderItem("Jelly Side Menu by Vanport", () => {})}
        {this.renderItem("Toggle Side Menu", () => {this.jsm.toggleSideMenu();})}
        {this.renderItem("Close Side Menu", () => {this.jsm.toggleSideMenu(false);})}
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FF6644'}}>
        <JellySideMenu 
        ref={(view) => {this.jsm = view}}
        fill={"#FFF"} fillOpacity={1.0}
        renderMenu={this.renderMenu}>

          <TouchableOpacity onPress={() => {this.jsm.toggleSideMenu(true)}}>
            <View style={[this.itemStyle, {backgroundColor: '#FF7788'}]}>
              <Text style={this.itemTextStyle}>Open Jelly Menu</Text>
            </View>
          </TouchableOpacity>

        </JellySideMenu>
      </View>
    )
  }
}
```


### Milestones
```
✔ iOS Support @done (16-07-09 12:07)
✔ Android Support @done (16-07-09 12:07)
☐ Context control toggle support
☐ Remove unnecessary imports
☐ Add Essential control parameters support (enable/disable menu, enable/disable gesture, set default state)
☐ Add Callback support (onWillOpen(state), onDidOpen(state), onWillClose(state), onDidClose(state))
☐ Add Menu State check function (getState() => State)
☐ Add Fine tune control parameters support (thresholds of dragging, menu width, bounce tension & friction)
☐ Add Side menu docking direction support (top, left, right, bottom)
☐ Cater device orientation change
☐ Performance improvement
