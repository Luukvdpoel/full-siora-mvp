import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export interface PersonaData {
  persona: string
  strengths?: string
  tone: string
  niche: string
  highlights?: string
  handle?: string
  date: string
}

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: 'Helvetica' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#7c3aed' },
  subHeader: { fontSize: 12, textAlign: 'center', marginBottom: 16, color: '#475569' },
  section: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 12, marginBottom: 4 },
})

export default function PersonaPDF({ data }: { data: PersonaData }) {
  const { handle, persona, strengths, tone, niche, highlights, date } = data
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Siora Creator Persona</Text>
        <Text style={styles.subHeader}>{date}{handle ? ` | ${handle}` : ''}</Text>
        {handle && (
          <View style={styles.section}>
            <Text style={styles.label}>Creator</Text>
            <Text style={styles.text}>{handle}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.label}>Persona</Text>
          <Text style={styles.text}>{persona}</Text>
        </View>
        {strengths && (
          <View style={styles.section}>
            <Text style={styles.label}>Strengths</Text>
            <Text style={styles.text}>{strengths}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.label}>Tone</Text>
          <Text style={styles.text}>{tone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Niche</Text>
          <Text style={styles.text}>{niche}</Text>
        </View>
        {highlights && (
          <View style={styles.section}>
            <Text style={styles.label}>Highlights</Text>
            <Text style={styles.text}>{highlights}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
