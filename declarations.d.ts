declare module '*.png' {
    const content: import('react-native').ImageSourcePropType;
    export default content;
  }  

  declare module '*.jpg' {
    const value: string;
    export default value;
  }
  
  declare module '*.jpeg' {
    const value: string;
    export default value;
  }
  
  declare module '*.gif' {
    const value: string;
    export default value;
  }
  declare module '@env' {
    export const EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  }
  