const fs = require('fs');

const tripState = fs.readFileSync('/tmp/claude-1000/-home-susan-tripsmanduStatic/6ee20ea1-f641-42d0-96c0-ed25860b9935/scratchpad/tripstate.js', 'utf8');

let dashboard = fs.readFileSync('dashboard.html', 'utf8');

// Add tripstate before </body>
const stateTag = `<script>\n${tripState}\n</script>`;
dashboard = dashboard.replace('</body>', stateTag + '\n</body>');

// Update NOTICES to show bookings from state
dashboard = dashboard.replace(
  'const NOTICES = [',
  `const BOOKINGS_FROM_STATE = TripState?.getBookings?.() || [];
const NOTICES = BOOKINGS_FROM_STATE.length > 0 
  ? BOOKINGS_FROM_STATE.map((b, i) => ({
      id: i + 100,
      title: \`Flight \${b.flight?.airline} (\${b.flight?.code}) - Booking \${b.id}\`,
      date: b.bookedAt,
      read: false,
      body: \`\${b.flight?.depCode} → \${b.flight?.arrCode} on \${b.flight?.depDate}. Passenger: \${b.passenger?.firstName} \${b.passenger?.lastName}\`
    }))
  : [`
);

fs.writeFileSync('dashboard.html', dashboard);
console.log('✓ Dashboard wired to show bookings');
