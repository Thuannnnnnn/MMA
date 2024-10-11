import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  signInImage: {
    width: '60%',
    height: 190,
    alignSelf: 'center',
    marginTop: 50,
  },

  welcomeText: {
    textAlign: 'center',
    fontSize: 24,
  },
 
  learningText: {
    textAlign: 'center',
    color: '#575757',
    fontSize: 15,
    marginTop: 10,
  },

  inputContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    rowGap: 30,
    borderTopLeftRadius: 10,
  },

  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#A1A1A1',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15
  },
  icon2:{
    position: "absolute",
    left: 24,
    top: 17.8,
    marginTop: -2
  },
  forgotSection:{
    marginHorizontal: 2,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
    fontWeight: 600
  },
  
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    position: "absolute",
    top: 60,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  emailInput: {
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#2467EC',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  signUpRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10
  },
  redirectText: {
    fontSize: 18,
    color: '#2467EC',
    marginLeft: 5,
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});
