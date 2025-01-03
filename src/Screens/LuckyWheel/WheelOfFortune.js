import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import * as d3Shape from 'd3-shape';

import Svg, {G, Text, TSpan, Path, Pattern} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const {width, height} = Dimensions.get('screen');

class WheelOfFortune extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      started: false,
      finished: false,
      winner: null,
      gameScreen: new Animated.Value(width - 40),
      wheelOpacity: new Animated.Value(1),
      imageLeft: new Animated.Value(width / 2 - 30),
      imageTop: new Animated.Value(height / 2 - 70),
      centerImage: this.props.options.icon[0],
    };
    this.angle = 0;

    this.prepareWheel();
  }

  prepareWheel = () => {
    // console.log('props',this.props);
    this.Rewards = this.props.options.rewards;
    this.RewardCount = this.Rewards.length;
    this.RewardImg = this.props.options.icon;
    this.numberOfSegments = this.RewardCount;
    this.fontSize = 16;
    this.oneTurn = 360;
    this.angleBySegment = this.oneTurn / this.numberOfSegments;
    this.angleOffset = this.angleBySegment / 2;
    this.winner = this.props.options.winner
      ? this.props.options.winner
      : Math.floor(Math.random() * this.numberOfSegments);

    this._wheelPaths = this.makeWheel();
    this._angle = new Animated.Value(0);

    this.props.options.onRef(this);
  };

  resetWheelState = () => {
    this.setState({
      enabled: false,
      started: false,
      finished: false,
      winner: null,
      gameScreen: new Animated.Value(width - 40),
      wheelOpacity: new Animated.Value(1),
      imageLeft: new Animated.Value(width / 2 - 30),
      imageTop: new Animated.Value(height / 2 - 70),
    });
  };

  _tryAgain = () => {
    this.prepareWheel();
    this.resetWheelState();
    this.angleListener();
    this._onPress();
  };

  angleListener = () => {
    this._angle.addListener(event => {
      if (this.state.enabled) {
        this.setState({
          enabled: false,
          finished: false,
        });
      }

      this.angle = event.value;
      const currentSegmentIndex = this._getWinnerIndex();
      this.setState({
        centerImage: this._wheelPaths[currentSegmentIndex].imgValue,
      });
    });
  };

  componentWillUnmount() {
    this.props.options.onRef(undefined);
  }

  componentDidMount() {
    this.angleListener();
  }

  makeWheel = () => {
    const data = Array.from({length: this.numberOfSegments}).fill(1);
    const arcs = d3Shape.pie()(data);
    var colors = this.props.options.colors
      ? this.props.options.colors
      : [
          '#E07026',
          '#E8C22E',
          '#ABC937',
          '#4F991D',
          '#22AFD3',
          '#5858D0',
          '#7B48C8',
          '#D843B9',
          '#E23B80',
          '#D82B2B',
        ];
    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2 - 10)
        .innerRadius(this.props.options.innerRadius || 100);
      return {
        path: instance(arc),
        color: colors[index % colors.length],
        value: this.Rewards[index],
        centroid: instance.centroid(arc),
        textColor: this.props?.options?.textcolors[index],
        icon: this.props?.options?.icon[index],
        imgValue: this.RewardImg[index]
      };
    });
  };

  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % this.oneTurn));
    // wheel turning counterclockwise
    if (this.angle < 0) {
      return Math.floor(deg / this.angleBySegment);
    }
    // wheel turning clockwise
    return (
      (this.numberOfSegments - Math.floor(deg / this.angleBySegment)) %
      this.numberOfSegments
    );
  };

  _onPress = () => {
    const duration = this.props.options.duration || 10000;
    this.setState({
      started: true,
      finished: false,
    });
    Animated.timing(this._angle, {
      toValue:
        365 -
        this.winner * (this.oneTurn / this.numberOfSegments) +
        360 * (duration / 1000),
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      const winnerIndex = this._getWinnerIndex();
      this.setState({
        finished: true,
        winner: this._wheelPaths[winnerIndex].value,
      });
      console.log(this._wheelPaths[winnerIndex]);
      this.props.getWinner(
        this._wheelPaths[winnerIndex].value,
        winnerIndex,
        this.state.finished,
        this._wheelPaths[winnerIndex],
        this._wheelPaths[winnerIndex],
      );
    });
  };

  imageResponsiveRender = (x, y, number, i) => {
    return (
      <Animated.View
        style={{
          width: width,
          height: width,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          top: -20,
          position: 'absolute',
        }}>
        <Svg width={30} height={30} viewBox={`0 0 57 100`}>
          <Image
            source={this.props.options.icon[i]}
            style={{
              position: 'absolute',
              top:
                this.props.options.textAngle === 'oppvertical' &&
                this.props.options.angleStep !== false
                  ? y * 1.34
                  : this.props.options.textAngle === 'horizontal'
                  ? y / 1.2
                  : y / 2,
              left:
                this.props.options.textAngle === 'oppvertical' &&
                this.props.options.angleStep !== false
                  ? x * 1.34
                  : this.props.options.textAngle === 'horizontal'
                  ? x / 1.2
                  : x / 2,
              height: 30,
              width: 30,
              resizeMode: 'contain',
            }}
          />
        </Svg>
      </Animated.View>
    );
  };

  _textRender = (x, y, number, i) => {
    const charSpacing = this.fontSize - 5; // Spacing between characters
    const baseAngle = -90; // Fixed base angle for each letter
    return (
      <>
        <Text
          x={x - number.length * 5}
          y={
            this.props.options.textAngle === 'vertical'
              ? y - 65
              : this.props.options.textAngle === 'oppvertical'
              ? y - 60
              : y - 50
          }
          fill={
            this.props.options.textColor ? this.props.options.textColor : '#fff'
          }
          textAnchor="middle"
          fontSize={this.fontSize}>
          {Array.from({length: number.length}).map((_, j) => {
            // Render reward text vertically
            if (this.props.options.textAngle === 'vertical') {
              return (
                <TSpan x={x} dy={this.fontSize - 2} key={`arc-${i}-slice-${j}`}>
                  {number.charAt(j)}
                </TSpan>
              );
            }
            if (this.props.options.textAngle === 'oppvertical') {
              if (this.props.options.angleStep === false) {
                return (
                  <TSpan
                    x={x}
                    dy={this.fontSize - 2}
                    key={`arc-${i}-slice-${j}`}>
                    {/* Rotate vertically */}
                    {number.charAt(number.length - 1 - j)}
                  </TSpan>
                );
              } else {
                const charY = y + j * charSpacing; // Vertical positioning
                const charAngle = baseAngle + 5; // Fixed angle for each letter
                const adjustedX =
                  x + Math.cos((Math.PI / 180) * charAngle) * 3 + 5; // Adjust horizontally for perfect centering
                return (
                  <TSpan
                    x={adjustedX + 10} //text position change
                    y={charY}
                    dy={5}
                    key={`arc-${i}-slice-${j}`}
                    transform={`rotate(${charAngle}, ${x}, ${charY})`}>
                    {number.charAt(number.length - 1 - j)}
                  </TSpan>
                );
              }
            }

            // Render reward text horizontally
            if (this.props.options.textAngle === 'horizontal') {
              return (
                <TSpan
                  // y={y-60}
                  dx={this.fontSize * 0.07}
                  key={`arc-${i}-slice-${j}`}>
                  {number.charAt(j)}
                </TSpan>
              );
            }
          })}
        </Text>
      </>
    );
  };

  _renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        {this._renderKnob()}
        {this.props.options.knobCount === 2 && this._renderKnob2()}
        {this._renderKnob3()}

        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-this.oneTurn, 0, this.oneTurn],
                  outputRange: [
                    `-${this.oneTurn}deg`,
                    `0deg`,
                    `${this.oneTurn}deg`,
                  ],
                }),
              },
            ],
            backgroundColor: this.props.options.backgroundColor
              ? this.props.options.backgroundColor
              : '#fff',
            width: width - 20,
            height: width - 20,
            borderRadius: (width - 20) / 2,
            borderWidth: this.props.options.borderWidth
              ? this.props.options.borderWidth
              : 2,
            borderColor: this.props.options.borderColor
              ? this.props.options.borderColor
              : '#fff',
            opacity: this.state.wheelOpacity,
          }}>
          <AnimatedSvg
            width={this.state.gameScreen}
            height={this.state.gameScreen}
            viewBox={`0 0 ${width} ${width}`}
            style={{
              transform: [{rotate: `-${this.angleOffset}deg`}],
              margin: 10,
            }}>
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                const number = arc.value.toString();

                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} strokeWidth={2} fill={arc.color} />
                    <G
                      rotation={
                        (i * this.oneTurn) / this.numberOfSegments +
                        this.angleOffset
                      }
                      origin={`${x}, ${y}`}>
                      {this._textRender(x, y, number, i)}
                      {this.imageResponsiveRender(x, y, number, i)}
                    </G>
                  </G>
                );
              })}
            </G>
          </AnimatedSvg>
        </Animated.View>
      </View>
    );
  };

  _renderKnob = () => {
    const knobSize = this.props.options.knobSize
      ? this.props.options.knobSize
      : 20;
    // [0, this.numberOfSegments]

    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(
          Animated.subtract(this._angle, this.angleOffset),
          this.oneTurn,
        ),
        new Animated.Value(this.angleBySegment),
      ),
      1,
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          opacity: this.state.wheelOpacity,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: [
                  '0deg',
                  '0deg',
                  '35deg',
                  '-35deg',
                  '0deg',
                  '0deg',
                ],
              }),
            },
          ],
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 67}
          viewBox={`0 0 57 100`}
          style={{
            transform: [{translateY: 8}],
          }}>
          <Image
            source={
              this.props.options.knobSource
                ? this.props.options.knobSource
                : require('../../Assets/images/knob.png')
            }
            style={{width: knobSize, height: (knobSize * 100) / 57}}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderKnob2 = () => {
    const knobSize = this.props.options.knobSize
      ? this.props.options.knobSize
      : 20;
    // [0, this.numberOfSegments]

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize,
          justifyContent: 'flex-end',
          zIndex: 1,
          opacity: this.state.wheelOpacity,
          // backgroundColor:'green',
          position: 'absolute',
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 67}
          viewBox={`0 0 57 100`}
          style={{
            transform: [{translateY: -5}, {rotate: '180deg'}],
          }}>
          <Image
            source={
              this.props.options.knobSource
                ? this.props.options.knobSource
                : require('../../Assets/images/knob.png')
            }
            style={{
              width: knobSize - 10,
              height: (knobSize * 100) / 87,
              left: 5,
            }}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderKnob3 = () => {
    const knobSize = this.props.options.knobSize
      ? this.props.options.knobSize
      : 20;
    // [0, this.numberOfSegments]

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize,
          justifyContent: 'flex-end',
          zIndex: 1,
          opacity: this.state.wheelOpacity,
          // backgroundColor:'green',
          position: 'absolute',
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 67}
          viewBox={`0 0 57 100`}
          style={{
            transform: [{translateY: 37}, {translateX: 0}],
          }}>
          <Image
            source={this.state.centerImage}
            style={{
              width: knobSize,
              height: knobSize,
            }}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderTopToPlay() {
    if (this.state.started == false) {
      return (
        <TouchableOpacity onPress={() => this._onPress()}>
          {this.props.options.playButton()}
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={{
            position: 'absolute',
            width: width,
            height: height / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Animated.View style={[styles.content, {padding: 10}]}>
            {this._renderSvgWheel()}
          </Animated.View>
        </TouchableWithoutFeedback>
        {this.props.options.playButton ? this._renderTopToPlay() : null}
      </View>
    );
  }
}

export default WheelOfFortune;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // bottom:20,
  },
  content: {},
  startText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});
