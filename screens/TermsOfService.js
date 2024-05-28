import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TermsOfService = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.termsh1}>Terms of Service for Thlorall</Text>
      <Text style={{marginTop:20}}>Effective Date: December 8/2023</Text>
      <Text style={styles.termsh2}>1. Acceptance of Terms</Text>
      <Text style={styles.termsh3}>By accessing or using the Thlorall app, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our app.</Text>

      <Text style={styles.termsh2}>2. User Accounts</Text>
      <Text style={styles.termsh2}>a. Account Creation:</Text>
      <Text style={styles.termsh3}>You must create an account to use certain features of the app. You agree to provide accurate and complete information during the registration process.</Text>

      <Text style={styles.termsh2}>b. Account Security:</Text>
      <Text style={styles.termsh3}>You are responsible for maintaining the security of your account and password. Notify us immediately of any unauthorized access or use of your account.</Text>


      <Text style={styles.termsh2}>3. User Content</Text>
      <Text style={styles.termsh2}>a. Ownership:</Text>
      <Text style={styles.termsh3}>You retain ownership of the content you post on Thlorall. By uploading, submitting, or displaying content on the app, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute the content.</Text>

      <Text style={styles.termsh2}>b. Prohibited Content:</Text>
      <Text style={styles.termsh3}>You may not post content that is illegal, harmful, threatening, abusive, defamatory, or violates the rights of others.</Text>

      <Text style={styles.termsh2}>4. App Usage Guidelines</Text>
      <Text style={styles.termsh2}>a. Compliance:</Text>
      <Text style={styles.termsh3}>You agree to comply with all applicable laws and regulations while using Thlorall.</Text>


      <Text style={styles.termsh2}>b. Prohibited Conduct:</Text>
      <Text style={styles.termsh3}>You may not engage in any conduct that disrupts or interferes with the functionality of the app.</Text>

      <Text style={styles.termsh2}>5. Privacy</Text>
      <Text style={styles.termsh2}>a. Data Collection:</Text>
      <Text style={styles.termsh3}>Our Privacy Policy outlines the types of information we collect, how we use it, and how it is shared. By using Thlorall, you agree to our Privacy Policy.</Text>


      <Text style={styles.termsh2}>6. Termination</Text>
      <Text style={styles.termsh3}>We reserve the right to terminate or suspend your account and access to Thlorall, with or without cause, at any time and without notice.</Text>


      <Text style={styles.termsh2}>7. Changes to the Terms of Service</Text>
      <Text style={styles.termsh3}>We may update these Terms of Service from time to time. The most current version will be posted on this page. Your continued use of the app after any changes constitute your acceptance of the revised terms.</Text>


      <Text style={styles.termsh2}>8. Disclaimer of Warranties</Text>
      <Text style={styles.termsh3}>Thlorall is provided "as is" without any warranties, expressed or implied. We do not warrant that the app will be error-free or uninterrupted.</Text>


      <Text style={styles.termsh2}>9. Limitation of Liability</Text>
      <Text style={styles.termsh3}>In no event shall ClearDesign or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of Thlorall.</Text>


      {/* <Text style={styles.termsh2}>10. Governing Law</Text>
      <Text style={styles.termsh3}>These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</Text> */}

      <Text style={styles.termsh2}>10. Contact Us</Text>
      <Text style={styles.termsh3}>If you have any questions or concerns about these Terms of Service, please contact us at
      
      email: cleardesignsapps@gmail.com
      phone: 3465044008
      </Text>





      </ScrollView>
    </View>
  )
}

export default TermsOfService

const styles = StyleSheet.create({
    container:{ 
        margin: 30
    },
    termsh1: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    termsh2: {
        marginTop:20,
        fontWeight: 'bold',

    }
})



// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const TermsOfService = () => {
//   return (
//     <View>
//       <Text>TermsOfService</Text>
//     </View>
//   )
// }

// export default TermsOfService

// const styles = StyleSheet.create({})