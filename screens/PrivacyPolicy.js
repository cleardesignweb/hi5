import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet, Button } from 'react-native';

const PrivacyPolicy = () => {
  const [policyContent, setPolicyContent] = React.useState(
    // Your Privacy Policy content goes here
    `
    **Privacy Policy for Thrlorall**

    Your privacy is important to us. It is Thrlorall's policy to respect your privacy regarding any information we may collect from you through our app.

    **Information We Collect**

    We may collect personal information that you provide directly to us, including but not limited to your name, photos, username, and email address. This information is collected for the purpose of enhancing your user experience and improving our app's features.

    **How We Use Your Information**

    The information we collect may be used for various purposes, including:

    - Providing, maintaining, and improving our app
    - Personalizing your experience
    - Sending periodic emails related to our services
    - Responding to your inquiries and providing customer support

    **Security**

    We take reasonable measures to protect the personal information we collect from unauthorized access, disclosure, alteration, and destruction.

    **Sharing Your Information**

    We may share your personal information with third-party service providers to facilitate our app's features and services. However, we will not sell, trade, or otherwise transfer your personal information to outside parties without your consent.

    **Your Choices**

    You may choose to restrict the collection or use of your personal information by adjusting the settings within our app. Please note that certain features may be limited if you choose not to provide certain information.

    **Changes to This Privacy Policy**

    We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.

    **Contact Us**

    If you have any questions or concerns about our Privacy Policy, please contact us at [cleardesignwebs@gmail.com].

    This Privacy Policy was last updated on [December 8/2023].
    `
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <TextInput
        style={styles.policyContent}
        multiline={true}
        value={policyContent}
        onChangeText={(text) => setPolicyContent(text)}
      />
     </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  policyContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});

export default PrivacyPolicy;










// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const PrivacyPolicy = () => {
//   return (
//     <View>
//       <Text>PrivacyPolicy</Text>
//     </View>
//   )
// }

// export default PrivacyPolicy

// const styles = StyleSheet.create({})