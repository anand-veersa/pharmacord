import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConstants {
  public TOKEN_EXPIRY_DURATION = 15;
  public MEDICINES = {
    MEDICINE_1: 'JEMPERLI',
    MEDICINE_2: 'ZEJULA',
    MEDICINE_3: 'OJJAARA',
    ALL: 'All',
  };

  // public BAR_CHART_LABELS =  {
  //     first: "Intake",
  //     second: "Insurance Auth Required",
  //     third: "Financial ServiceIn Progress",
  //     fourth: "PAP In, Process",
  //     fifth: "Other",
  //     sixth: "Total",
  // }
  public BAR_CHART = {
    BAR_CHART_LABELS: [
      'Intake',
      'Insurance Auth Required',
      'Financial Services In Process',
      'PAP In Progress',
      'Other',
      'Total',
    ],
    BAR_CHART_COLORS: [
      '#FF6633',
      '#924A98',
      '#E49B13',
      '#544F40',
      '#B3A99F',
      '#40488D',
    ],
    BAR_CHART_X_COORDINATES: [
      'Intake',
      'Insurance, Auth, Required',
      'Financial, Services In, Process',
      'PAP In, Progress',
      'Other',
      'Total',
    ],
  };
  public MAX_FILE_SIZE = 10485760;
  public PRESCRIBER_DECLARATION = `I certify that the information provided above is true and that ZEJULA is being prescribed for the patient listed above. I hereby certify that, for any insured patient seeking co-pay assistance under the Co-pay Program, in the absence of financial support from such program, any applicable co-pay, coinsurance, or other out-of-pocket cost for ZEJULA would be collected from the patient upon treatment. I appoint Together with GSK Oncology, on my behalf, to convey this prescription to the dispensing pharmacy, to the extent permitted under state law.<br><br>
    <strong>Special Note:</strong> Prescribers in all states must follow applicable laws for a valid prescription. For prescribers in states with official prescription form requirements, please submit an actual prescription along with this enrollment form. Prescribers may need to submit an electronic prescription to the specialty pharmacy.`;
  public TEXTING_CONSENT = `By opting into texting you authorize GSK and its service providers to contact you and send communications about your enrollment in Together with GSK Oncology via telephone and text message. These calls or text messages may be generated using auto-dial or pre-recorded messages at the number you submit. The number and type of messages will be based upon your program selections, and message and data rates may apply. At any time, you may request to stop telephone calls or text messages by following the opt-out directions provided during those communications.`;
  public PAP_CONSENT = `Applicants authorize the Together with GSK Oncology PAP and its Administrators to obtain a consumer report. The consumer report, and the information derived from public and other sources, will be used to estimate income as part of the process to decide eligibility to receive free medication from GSK Oncology PAP. Upon request, GSK PAP will provide applicants with the name and address of the consumer reporting agency that provides the consumer report. The program may request additional documents and information at any time, even after enrollment, to determine if the information on the enrollment form is complete and true. For additional questions about eligibility, please contact the program.`;
  public PSP_CONSENT = `GSK believes your privacy is important. By providing your name, address, email address, and other information, you are giving GSK and companies working for or with GSK permission to contact you for marketing, market research, or advertising purposes, or to invite you to interact with GSK in other ways across multiple channels (eg, mail, email, websites, online advertising, applications, and services) regarding the medical condition(s) in which you have expressed an interest, as well as other health-related information from GSK. GSK will not sell or transfer your name, address, or email address to any other party for their own marketing use. For additional information regarding how GSK handles your information, please see our privacy statement at <a class="links text-medium" href="https://privacy.gsk.com/en-us/" target="_blank">https://privacy.gsk.com/en-us/</a>. You are encouraged to report negative side effects of prescription drugs to the FDA. Visit <a class="links text-medium" href="https://fda.gov/medwatch" target="_blank">www.fda.gov/medwatch</a> or call <span class="links text-medium"> 1-800-FDA-1088 </span>.`;
  public HIPPA_CONSENT_JEMPERLI = `I agree to allow my doctors, pharmacies, including my specialty pharmacy(ies), and health insurers (collectively “Healthcare Providers”), to use and disclose my health information to GSK and its agents, authorized representatives, and contractors (collectively “GSK”) so that GSK can use and disclose my health information for purposes of providing Together with GSK Oncology services, which may include the following activities:<br><br>
    1. Communicating with my Healthcare Providers about my JEMPERLI prescription and medical condition;<br><br>
    2. Providing ophthalmology support, including ophthalmologist referral information and appointment reminders;<br><br>
    3. Investigating and resolving my insurance coverage, coding, or reimbursement inquiry, or reviewing my eligibility for GSK’s patient assistance and co-pay assistance programs;<br><br>
    4. Contacting my insurer, other potential funding sources, and/or patient assistance programs on my behalf to determine if I am eligible for health insurance coverage or other funds;<br><br>
    5. Disclosing my information to third parties if required by law.<br><br>
    By signing this authorization, I acknowledge my understanding that:<br><br>
    &#8226; My Healthcare Providers will not and may not condition my treatment, payment for treatment, or eligibility for or enrollment in benefits on whether I sign this patient authorization.<br><br>
    &#8226; Certain Healthcare Providers, such as specialty pharmacies, may receive payment from GSK for disclosing my information to GSK as permitted by this authorization.<br><br>
    &#8226; Once information about me is released to GSK based on this authorization, federal privacy laws may no longer protect my information and may not prevent GSK from further disclosing my information. However, I understand that GSK has agreed to use or disclose information received only for the purposes described in this authorization or as required by law.<br><br>
    &#8226; This authorization will remain in effect for two (2) years after I sign it (unless a shorter period is required by state law) or for as long as I participate in the Together with GSK Oncology program, whichever is longer.<br><br>
    &#8226; I have the right to revoke this authorization at any time by mailing a signed written statement of my revocation to Together with GSK Oncology, P.O. Box 220664, Charlotte NC 28222, but such a revocation would end my eligibility to participate in the Together with GSK Oncology program. Revoking this authorization will prohibit further disclosures by my Healthcare Providers based on this authorization after the date a written revocation is received, but will not apply to the extent that they have already taken action in reliance on this authorization. After this authorization is revoked, I understand that information provided to GSK prior to the revocation may be disclosed within GSK to maintain records of my participation.
  `;
  public HIPPA_CONSENT_ZEJULA = `I agree to allow my doctors, pharmacies, including my specialty pharmacy(ies), and health insurers (collectively “Healthcare Providers”), to use and disclose my health information to GSK and its agents, authorized representatives, and contractors (collectively “GSK”) so that GSK can use and disclose my health information for purposes of providing Together with GSK Oncology services, which may include the following activities:<br><br>
    1. Communicating with my Healthcare Providers about my ZEJULA prescription and medical condition;<br><br>
    2. Investigating and resolving my insurance coverage, coding, or reimbursement inquiry, or reviewing my eligibility for GSK’s patient assistance and co-pay assistance programs;<br><br>
    3. Contacting my insurer, other potential funding sources, and/or patient assistance programs on my behalf to determine if I am eligible for health insurance coverage or other funds;<br><br>
    4. Contacting me to offer (and, if I am interested, provide) optional educational services offered by healthcare professionals; and<br><br>
    5. Disclosing my information to third parties if required by law.<br><br>
    By signing this authorization, I acknowledge my understanding that:<br><br>
    &#8226; My Healthcare Providers will not and may not condition my treatment, payment for treatment, or eligibility for or enrollment in benefits on whether I sign this patient authorization.<br><br>
    &#8226; Certain Healthcare Providers, such as specialty pharmacies, may receive payment from GSK for disclosing my information to GSK as permitted by this authorization.<br><br>
    &#8226; Once information about me is released to GSK based on this authorization, federal privacy laws may no longer protect my information and may not prevent GSK from further disclosing my information. However, I understand that GSK has agreed to use or disclose information received only for the purposes described in this authorization or as required by law.<br><br>
    &#8226; This authorization will remain in effect for two (2) years after I sign it (unless a shorter period is required by state law) or for as long as I participate in the Together with GSK Oncology program, whichever is longer.<br><br>
    &#8226; I have the right to revoke this authorization at any time by mailing a signed written statement of my revocation to Together with GSK Oncology, P.O. Box 5490, Louisville, KY 40255, but such a revocation would end my eligibility to participate in the Together with GSK Oncology program. Revoking this authorization will prohibit further disclosures by my Healthcare Providers based on this authorization after the date a written revocation is received, but will not apply to the extent that they have already taken action in reliance on this authorization. After this authorization is revoked, I understand that information provided to GSK prior to the revocation may be disclosed within GSK to maintain records of my participation.
  `;
  public HIPPA_CONSENT_OJJAARA = `
    I agree to allow my doctors, pharmacies, including my specialty pharmacy(ies), and health insurers (collectively “Healthcare Providers”), to use and disclose my health information to GSK and its agents, authorized representatives, and contractors (collectively “GSK”) so that GSK can use and disclose my health information for purposes of providing Together with GSK Oncology services, which may include the following activities:<br><br>
    1. Communicating with my Healthcare Providers about my OJJAARA prescription and medical condition;<br><br>
    2. Investigating and resolving my insurance coverage, coding, or reimbursement inquiry, or reviewing my eligibility for GSK’s patient assistance and co-pay assistance programs;<br><br>
    3. Contacting my insurer, other potential funding sources, and/or patient assistance programs on my behalf to determine if I am eligible for health insurance coverage or other funds;<br><br>
    4. Contacting me to offer (and, if I am interested, provide) optional educational services offered by healthcare professionals; and<br><br>
    5. Disclosing my information to third parties if required by law.<br><br>
    By signing this authorization, I acknowledge my understanding that:<br><br>
    &#8226; My Healthcare Providers will not and may not condition my treatment, payment for treatment, or eligibility for or enrollment in benefits on whether I sign this patient authorization.<br><br>
    &#8226; Certain Healthcare Providers, such as specialty pharmacies, may receive payment from GSK for disclosing my information to GSK as permitted by this authorization.<br><br>
    &#8226; Once information about me is released to GSK based on this authorization, federal privacy laws may no longer protect my information and may not prevent GSK from further disclosing my information. However, I understand that GSK has agreed to use or disclose information received only for the purposes described in this authorization or as required by law.<br><br>
    &#8226; This authorization will remain in effect for two (2) years after I sign it (unless a shorter period is required by state law) or for as long as I participate in the Together with GSK Oncology program, whichever is longer.<br><br>
    &#8226; I have the right to revoke this authorization at any time by mailing a signed written statement of my revocation to Together with GSK Oncology, P.O. Box 5490, Louisville, KY 40255, but such a revocation would end my eligibility to participate in the Together with GSK Oncology program. Revoking this authorization will prohibit further disclosures by my Healthcare Providers based on this authorization after the date a written revocation is received, but will not apply to the extent that they have already taken action in reliance on this authorization. After this authorization is revoked, I understand that information provided to GSK prior to the revocation may be disclosed within GSK to maintain records of my participation.
  `;
  public PROVIDER_ROLE = 3;
  public OTHERS_ROLE = 4;
}
