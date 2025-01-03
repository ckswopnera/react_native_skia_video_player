import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import WheelOfFortune from './WheelOfFortune';
import HexagonView from './HexagonView';
import ProgressBar from './ProgressBar';
import LottieView from 'lottie-react-native';
import Explosion from './Confetti';
import * as Animatable from 'react-native-animatable';
const {width, height} = Dimensions.get('window');
const winner = [
  {
    participant: 'Pizza',
    color: '#E07026',
    text_Color: 'rgb(224, 112, 38)',
    image: require('../../Assets/images/pizza.png'),
  },
  {
    participant: 'Noodles',
    color: '#E8C22E',
    text_Color: 'rgb(232, 194, 46)',
    image: require('../../Assets/images/noodles.png'),
  },
  {
    participant: 'Burger',
    color: '#ABC937',
    text_Color: 'rgb(171, 201, 55)',
    image: require('../../Assets/images/hamburger.png'),
  },
  {
    participant: 'Sushi',
    color: '#4F991D',
    text_Color: 'rgb(79, 153, 29)',
    image: require('../../Assets/images/sushi.png'),
  },
  {
    participant: 'Chicken',
    color: '#22AFD3',
    text_Color: 'rgb(34, 175, 211)',
    image: require('../../Assets/images/chicken_leg.png'),
  },
  {
    participant: 'Tacos',
    color: '#5858D0',
    text_Color: 'rgb(88, 88, 208)',
    image: require('../../Assets/images/taco.png'),
  },
  {
    participant: 'Salad',
    color: '#7B48C8',
    text_Color: 'rgb(123, 72, 200)',
    image: require('../../Assets/images/salad.png'),
  },
  {
    participant: 'Ramen',
    color: '#D843B9',
    text_Color: 'rgb(216, 67, 185)',
    image: require('../../Assets/images/ramen.png'),
  },
  {
    participant: 'FREE',
    color: '#D82B2B',
    text_Color: 'rgb(216, 43, 43)',
    image: require('../../Assets/images/free.png'),
  },
];
class LuckyWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
      currentStep: 0,
      totalStep: 5,
      finished: false,
      duration: 5000,
      finalWinner: null,
      modalVisible: false,
      explosionCount: 0,
      scaleAnim: new Animated.Value(1),
    };
    this.child = null;
    this.confettiRef = createRef();
    this.rotationRef = createRef();
  }
  handleTextRef = ref => (this.view = ref);
  buttonPress = () => {
    if (this.child) {
      this.child._tryAgain();
    }
    this.setState(prevState => ({
      started: true, // Mark that the spin has started
      finished: false,
      //currentStep: prevState.currentStep + 1,
      winnerIndex: null,
      modalVisible: false, // Reset modal visibility
    }));
    setTimeout(() => {
      this.setState({
        finished: false,
        started: false,
      });
    }, this.state.duration + 500);
    if (this.child) {
      this.child._onPress();
    }
  };
  handleWinner = (value, index, finished, winner) => {
    this.setState({
      finished: true,
    });

    if (this.state.finished) {
      if (value !== 'FREE') {
        this.setState(prevState => ({
          currentStep: prevState.currentStep + 1,
        }));
      }

      this.setState({
        winnerValue: value,
        winnerIndex: index,
        finished: finished,
        finalWinner: winner,
        modalVisible: true,
      });
    }
  };
  closeModal = () => {
    this.setState({modalVisible: false, finished: false});
    //this.confettiRef.current.stop();
  };

  triggerExplosions = () => {
    if (this.rotationRef.current) {
      this.rotationRef.current.rotate(360);
    }

    const {explosionCount} = this.state;

    if (explosionCount === 0) {
      this.setState({explosionCount: 1});
      if (this.confettiRef.current) {
        this.confettiRef.current.start();
      }
      setTimeout(() => {
        if (this.confettiRef.current) {
          this.confettiRef.current.start();
        }
        this.setState({explosionCount: 0});
      }, 2500);
    }
  };

  handlePressIn = () => {
    Animated.spring(this.state.scaleAnim, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  handlePressOut = () => {
    Animated.spring(this.state.scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const wheelOptions = {
      rewards: winner.map((i, j) => i.participant),
      knobSize: 25,
      borderWidth: 20,
      borderColor: '#fff',
      innerRadius: 20,
      duration: this.state.duration,
      backgroundColor: '#fff',
      textAngle: 'oppvertical',
      knobSource: require('../../Assets/images/knob.png'),
      onRef: ref => (this.child = ref),
      knobCount: 2,
      colors: winner.map((i, j) => i.color),
      textcolors: winner.map((i, j) => i.text_Color),
      icon: winner.map((i, j) => i.image),
      angleStep: true,
    };
    return (
      <>
        <StatusBar
          backgroundColor={
            this.state.finalWinner === null
              ? '#C30192'
              : this.state.finalWinner?.color
          }
        />
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                this.state.finalWinner === null
                  ? '#C30192'
                  : this.state.finalWinner?.color,
            },
          ]}>
          <Text
            style={{
              color: '#FBE4FE',
              fontSize: 32,
              fontFamily: 'DancingScript-Medium',
              // top:50
              textAlign: 'center',
            }}>
            What to eat?
          </Text>
          {this.state.winnerIndex || this.state.winnerIndex === 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: this.state.finalWinner?.text_Color,
                  fontSize: 20,
                  opacity: 0.3,
                  fontFamily: 'DancingScript-Medium',
                  textAlign: 'center',
                  padding: 10,
                }}>
                You won {this.state.winnerValue}
              </Text>
              <View
                style={{
                  width: 30,
                  height: 30,
                  marginTop: 4,
                  marginLeft: 8,
                }}>
                <Image
                  source={winner[this.state.winnerIndex]?.image}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            </View>
          ) : (
            <Text
              style={{
                color: '#E965D8',
                fontSize: 28,
                fontFamily: 'DancingScript-Medium',
                textAlign: 'center',
              }}>
              choosing...
            </Text>
          )}
          <WheelOfFortune
            options={wheelOptions}
            getWinner={this.handleWinner}
          />
          <ProgressBar
            totalStep={this.state.totalStep}
            currentStep={this.state.currentStep}
          />
          <TouchableOpacity
            onPress={this.buttonPress}
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              opacity:
                this.state.finished === true ||
                this.state.currentStep >= this.state.totalStep ||
                this.state.started
                  ? 0.4
                  : 1,
            }}
            disabled={
              this.state.finished === true ||
              this.state.currentStep >= this.state.totalStep ||
              this.state.started
            }>
            <Animatable.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{scale: this.state.scaleAnim}],
              }}>
              <HexagonView />
              <Text
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  color: 'rgba(255, 223, 0, 1)',
                  fontSize: 25,
                  fontFamily: 'DancingScript-Medium',
                  bottom: 51,
                  textDecorationStyle: 'solid',
                  textTransform: 'uppercase',
                }}>
                Spin
              </Text>
            </Animatable.View>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={this.state.modalVisible}
            onRequestClose={this.closeModal}
            style={styles.modalView}
            onShow={this.triggerExplosions}>
            <>
              <Explosion
                ref={this.confettiRef}
                count={100}
                colors={['#FF0000', '#00FF00', '#0000FF', '#FFFF00']} // Custom confetti colors
                origin={{x: width / 2, y: height + 60}}
                fallSpeed={6000} // Duration for falling
                explosionSpeed={1000} // Duration for explosion
                fadeOut={true} // Confetti fades out as it falls
                style={styles.explosionStyle} // Custom styling for the explosion container
              />
              <TouchableOpacity
                style={styles.centeredView}
                activeOpacity={1}
                // onPressOut={this.closeModal}
              >
                <Animatable.View
                  ref={this.rotationRef}
                  animation="rotate"
                  duration={2000}
                  style={[styles.modalView]}
                  useNativeDriver={true}>
                  <LottieView
                    source={require('../../Assets/animations/success.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottieStyle}
                  />
                  <View
                    style={{
                      backgroundColor:
                        this.state.finalWinner?.color ?? '#4FD05B',
                      width: '100%',
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.modalText}>Hurray!</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.modalText}>
                        You won "{this.state.winnerValue}"
                      </Text>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 10,
                          marginLeft: 8,
                        }}>
                        <Animatable.View
                          animation={'pulse'}
                          iterationCount="infinite"
                          duration={500}
                          useNativeDriver={true}>
                          <Image
                            source={winner[this.state.winnerIndex]?.image}
                            style={{width: '100%', height: '100%'}}
                          />
                        </Animatable.View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={this.closeModal}>
                      <Text
                        style={{
                          ...styles.textStyle,
                          color: this.state.finalWinner?.color ?? '#000',
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            </>
          </Modal>
        </View>
      </>
    );
  }
}
export default LuckyWheel;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  startButtonView: {
    position: 'absolute',
    bottom: 50,
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 50,
    padding: 5,
  },
  startButtonText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // tryAgainButton: {
  //   padding: 10,
  // },
  winnerText: {
    fontSize: 20,
    fontFamily: 'DancingScript-Medium',
    paddingVertical: 18,
    textAlign: 'center',
  },
  tryAgainButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 16,
    fontFamily: 'DancingScript-Bold',
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  lottieStyle: {
    width: 150,
    height: 150,
  },
  modalText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 28,
    color: '#fff',
    fontFamily: 'DancingScript-Bold',
  },
  modalView: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    paddingVertical: 7,
    marginVertical: 30,
    width: 150,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'DancingScript-Bold',
    textAlign: 'center',
    fontSize: 18,
  },
  explosionStyle: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
