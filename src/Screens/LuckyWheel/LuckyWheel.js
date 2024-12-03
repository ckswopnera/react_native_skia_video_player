import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import WheelOfFortune from './WheelOfFortune';
import HexagonView from './HexagonView';
import ProgressBar from './ProgressBar';

const winner = [
  {
    participant: 'Pizza',
    color: '#E07026',
  },
  {
    participant: 'Pasta',
    color: '#E8C22E',
  },
  {
    participant: 'Burger',
    color: '#ABC937',
  },
  {
    participant: 'Sushi',
    color: '#4F991D',
  },
  {
    participant: 'Chicken',
    color: '#22AFD3',
  },
  {
    participant: 'Tacos',
    color: '#5858D0',
  },
  {
    participant: 'Salad',
    color: '#7B48C8',
  },
  {
    participant: 'Tacos',
    color: '#D843B9',
  },
  {
    participant: 'FREE',
    color: '#D82B2B',
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
      duration: 6000,
      finalWinner: null,
    };
    this.child = null;
  }
  buttonPress = () => {
    if (this.child) {
      this.child._tryAgain();
    }

    this.setState(prevState => ({
      started: true, // Mark that the spin has started
      currentStep: prevState.currentStep + 1,
      winnerIndex: null,
    }));
    setTimeout(() => {
      this.setState({
        finished: false,
        started: false,
        // finalWinner:null,
        // winnerValue: null,
        // winnerIndex: null,
      });
    }, 6500);
    if (this.child) {
      this.child._onPress();
    }
  };
  render() {
    const wheelOptions = {
      rewards: winner.map((i, j) => i.participant),
      knobSize: 20,
      borderWidth: 5,
      borderColor: '#ffff',
      innerRadius: 20,
      duration: this.state.duration,
      backgroundColor: '#fff',
      textAngle: 'horizontal',
      knobSource: require('../../Assets/images/knob.png'),
      onRef: ref => (this.child = ref),
      knobCount: 1,
      colors: winner.map((i, j) => i.color),
    };
    return (
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
            fontFamily: 'Inter-Bold',
            // top:50
            textAlign: 'center',
          }}>
          What to eat?
        </Text>

        {this.state.winnerValue ? (
          <Text
            style={{
              color: '#E965D8',
              fontSize: 28,
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
            }}>
            You won {this.state.winnerValue}
          </Text>
        ) : (
          <Text
            style={{
              color: '#E965D8',
              fontSize: 28,
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
            }}>
            choosing...
          </Text>
        )}
        <WheelOfFortune
          options={wheelOptions}
          getWinner={(value, index, finished, winner) => {
            // console.log({finished});

            this.setState({
              winnerValue: value,
              winnerIndex: index,
              finished: finished, // This will be true when the wheel finishes spinning
              finalWinner: winner,
            });
          }}
        />

        <ProgressBar
          totalStep={this.state.totalStep}
          currentStep={this.state.currentStep}
        />

        <TouchableOpacity
          onPress={this.buttonPress}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity:
              this.state.finished === true ||
              this.state.currentStep >= this.state.totalStep ||
              this.state.started // Add condition to disable the button while spinning
                ? 0.4
                : 1,
          }}
          disabled={
            this.state.finished === true ||
            this.state.currentStep >= this.state.totalStep ||
            this.state.started // Disable if the spin has started
          }>
          <HexagonView />
          <Text
            style={{
              position: 'absolute',
              alignSelf: 'center',
              color: 'rgba(255, 223, 0,1)',
              fontSize: 28,
              fontFamily: 'Inter-SemiBold',
              bottom: 51,
              textDecorationStyle: 'solid',
              textTransform: 'uppercase',
            }}>
            Spin
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default LuckyWheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Inter-Bold',
    paddingVertical: 18,
    textAlign: 'center',
  },
  tryAgainButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
