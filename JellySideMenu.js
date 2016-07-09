'use strict';

import rebound from 'rebound';

import React, {
  Alert,
  Platform,
  Animated,
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';

var {width, height} = Dimensions.get('window');

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
var SvgText = require('react-native-svg').Text;


class JellySideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_dock : false,
      offsetDragX : 0,
      offsetDragY : height / 2,
    }
    this.makePanResponder();
  }

  makePanResponder() {
    var self = this;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: function(e, gestureState) {
        return true
      },
      onMoveShouldSetPanResponder: function(e, gestureState) {
        return true
      },
      onPanResponderGrant: function(e, gestureState) {
        self.onDropSideMenuSvg()
      },
      onPanResponderMove: function(e, gestureState) {
        self.onDragSideMenuSvg(gestureState.dx, gestureState.moveY)
      },
      onPanResponderRelease: function(e, gestureState) {
        if (gestureState.dx > 100) {
          self.onDropSideMenuSvg(true)
        } else {
          self.onDropSideMenuSvg(false)
        }
      },
      onPanResponderTerminate: function(e, gestureState) {
        if (gestureState.dx > 100) {
          self.onDropSideMenuSvg(true)
        } else {
          self.onDropSideMenuSvg(false)
        }
      },
    })
  }

  getPanHandlers() {
    return this.panResponder.panHandlers;
  }

  onDragSideMenuSvg(x, y) {
    this.sideMenuSvg.setOffsetDrag(x, y, false)
  }

  onDropSideMenuSvg(bool) {
    if (bool) {
      this.setState({
        is_dock: true
      })
      this.sideMenuSvg.dockOffsetDrag(true)
    } else {
      this.setState({
        is_dock: false
      })
      this.sideMenuSvg.resetOffsetDrag(true)
    }
  }

  toggleSideMenu(bool) {
    if (bool == undefined) {
      this.onDropSideMenuSvg(!this.state.is_dock);
    } else {
      this.onDropSideMenuSvg(bool);
    }
  }


  render() {
    var dockPullWidth = 20;
    var dockWidth = 240;

    var offsetDragX = this.state.offsetDragX;
    var offsetDragY = this.state.offsetDragY;
    var pathSide = " 0 0 q " + offsetDragX + " " + offsetDragY + " 0 " + height;

    var dockStyle = {width: dockPullWidth};
    if (this.state.is_dock) {dockStyle = {width: null, right: 0}};

    return (
      <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
        {this.props.children}
        <View style={[{position: 'absolute', top: 0, left: 0, bottom: 0, backgroundColor: this.state.is_dock ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'}, dockStyle]} {...this.getPanHandlers()}>
        </View>
        {
          Platform.OS === "ios" ? (
            <JellySideMenuSvg fill={this.props.fill || "#FFF"} fillOpacity={this.props.fillOpacity || 0.9} height={height} dockWidth={dockWidth} ref={(view) => {this.sideMenuSvg = view}}/>
          ) : (
            <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: width - dockWidth - 30}}>
              <JellySideMenuSvg fill={this.props.fill || "#FFF"} fillOpacity={this.props.fillOpacity || 0.9} height={height} dockWidth={dockWidth} ref={(view) => {this.sideMenuSvg = view}}/>
            </View>
          )
        }
        <JellySideMenuContent is_dock={this.state.is_dock} dockWidth={dockWidth}>
          {this.props.renderMenu()}
        </JellySideMenuContent>
      </View>
    )
  }
}


class JellySideMenuContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dockOpacityAnim : new Animated.Value(0),
      dockLeftAnim : new Animated.Value(-this.props.dockWidth),
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.is_dock != this.props.is_dock) {
      if (nextProps.is_dock) {
        Animated.spring(this.state.dockOpacityAnim, {toValue: 1, friction: 10}).start()
        Animated.spring(this.state.dockLeftAnim, {toValue: 0, friction: 5}).start()
      } else {
        Animated.spring(this.state.dockOpacityAnim, {toValue: 0, friction: 10}).start()
        Animated.spring(this.state.dockLeftAnim, {toValue: -this.props.dockWidth, friction: 5}).start()
      }
    }
  }
  render() {
    var style = {width: this.props.dockWidth, position: 'absolute', top: 0, opacity: this.state.dockOpacityAnim, left: this.state.dockLeftAnim, bottom: 0, backgroundColor: 'transparent'}
    return (
      <Animated.View style={style}>
        {this.props.children}
      </Animated.View>
    )
  }
}


class JellySideMenuSvg extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      is_dock : false,
      is_undocked : true,
      offsetDragX : 0,
      offsetDragY : height / 2,
      offsetDragXSm : 0,
    }

    this.springSystem = new rebound.SpringSystem()
    this.springSystem2 = new rebound.SpringSystem()
    this.ssOffsetDragX = this.springSystem.createSpring()
    this.ssOffsetDragY = this.springSystem.createSpring()
    this.ssOffsetDragX.setCurrentValue(0)
    this.ssOffsetDragY.setCurrentValue(height / 2)
    this.ssOffsetDragX.addListener({onSpringUpdate: () => {
      if (this.ssOffsetDragX.getEndValue() <= 0) {
        if (this.state.offsetDragX <= 0 && !this.state.is_undocked) {
          this.setState({offsetDragX: this.ssOffsetDragX.getCurrentValue(), is_undocked: true});
          return;
        } else {
          this.setState({offsetDragX: this.ssOffsetDragX.getCurrentValue()});
          return;
        }
      } else {
        if (this.state.is_undocked) {
          this.setState({offsetDragX: this.ssOffsetDragX.getCurrentValue(), is_undocked: false});
          return;
        } else {
          this.setState({offsetDragX: this.ssOffsetDragX.getCurrentValue()});
          return;
        }
      }
    }})
    this.ssOffsetDragY.addListener({onSpringUpdate: () => {this.setState({offsetDragY: this.ssOffsetDragY.getCurrentValue()})}})
    this.ssOffsetDragXSm = this.springSystem2.createSpring()
    this.ssOffsetDragXSm.setCurrentValue(0)
    this.ssOffsetDragXSm.addListener({onSpringUpdate: () => {this.setState({offsetDragXSm: this.ssOffsetDragXSm.getCurrentValue()})}})

    var sscX = this.ssOffsetDragX.getSpringConfig();
    var sscY = this.ssOffsetDragY.getSpringConfig();
    var sscXSm = this.ssOffsetDragXSm.getSpringConfig();

    sscX.tension = 500;
    sscX.friction = 10;

    sscY.tension = 500;
    sscY.friction = 10;

    sscXSm.tension = 500;
    sscXSm.friction = 15;
  }


  setOffsetDrag(x, y, animated) {
    if (animated) {
      this.ssOffsetDragX.setEndValue(x / 2);
      this.ssOffsetDragY.setEndValue(y);
      this.ssOffsetDragXSm.setEndValue(x / 5);
    } else {
      this.ssOffsetDragX.setCurrentValue(x / 2);
      this.ssOffsetDragY.setCurrentValue(y);
      this.ssOffsetDragXSm.setCurrentValue(x / 5);
    }
  }

  resetOffsetDrag(animated) {
    if (animated) {
      this.ssOffsetDragX.setEndValue(0);
      this.ssOffsetDragY.setEndValue(height / 2);
      this.ssOffsetDragXSm.setEndValue(0);
    } else {
      this.ssOffsetDragX.setCurrentValue(0);
      this.ssOffsetDragY.setCurrentValue(height / 2);
      this.ssOffsetDragXSm.setCurrentValue(0);
    }
  }

  dockOffsetDrag(animated) {
    if (animated) {
      this.ssOffsetDragX.setEndValue(this.props.dockWidth);
      this.ssOffsetDragY.setEndValue(height / 2);
      this.ssOffsetDragXSm.setEndValue(this.props.dockWidth);
    } else {
      this.ssOffsetDragX.setCurrentValue(this.props.dockWidth);
      this.ssOffsetDragY.setCurrentValue(height / 2);
      this.ssOffsetDragXSm.setCurrentValue(this.props.dockWidth);
    }
  }

  render() {
    if (this.state.is_undocked) {
      return null
    }

    var offsetDragX = this.state.offsetDragX;
    var offsetDragY = this.state.offsetDragY;
    var offsetDragXSm = this.state.offsetDragXSm;
    var pathSide = "";
    var path = "";

    pathSide = "M" + offsetDragXSm + " 0";
    pathSide += " Q" + offsetDragX + " " + 0 + " " + offsetDragX + " " + offsetDragY;
    pathSide += " Q" + offsetDragX + " " + height + " " + offsetDragXSm + " " + height;
    path = pathSide + " L" + " 0 " + this.props.height + " L0 0 Z";

    return (
      <Svg
            style={[{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}]}
            width={width}
            height={height}
        >
          <Path
              d={path}
              fill={this.props.fill}
              fillOpacity={this.props.fillOpacity}/>
      </Svg>
    )
  }
}


module.exports = JellySideMenu;