import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { PersonaProfile } from '../types/persona'

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: 'Helvetica' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  section: { marginBottom: 10 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 12, marginBottom: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: { backgroundColor: '#eee', borderRadius: 4, padding: 4, fontSize: 10, marginRight: 4, marginBottom: 4 },
})

export default function PersonaPDF({ profile }: { profile: PersonaProfile }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{profile.name}</Text>
          <Text style={styles.text}>{profile.summary}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Personality</Text>
          <Text style={styles.text}>{profile.personality}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Interests</Text>
          <View style={styles.tagsRow}>
            {profile.interests.map((i, idx) => (
              <Text key={idx} style={styles.tag}>{i}</Text>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Posting Frequency</Text>
          <Text style={styles.text}>{profile.postingFrequency ?? 'N/A'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Tone Confidence</Text>
          <Text style={styles.text}>{profile.toneConfidence != null ? `${profile.toneConfidence}%` : 'N/A'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Brand Fit</Text>
          <Text style={styles.text}>{profile.brandFit ?? 'N/A'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Growth Suggestions</Text>
          <Text style={styles.text}>{profile.growthSuggestions ?? 'N/A'}</Text>
        </View>
      </Page>
    </Document>
  )
}
