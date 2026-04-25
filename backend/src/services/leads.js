const leads = [];
const bookings = [];
const flags = [];
let leadCounter = 1;
let bookingCounter = 1;
let flagCounter = 1;

export function saveLead(data) {
  const lead = {
    id: `LEAD-${String(leadCounter++).padStart(4, '0')}`,
    ...data,
    created_at: new Date().toISOString()
  };
  leads.push(lead);
  console.log(`\n🏠 NEW QUOTE REQUEST\n${'─'.repeat(40)}`);
  console.log(`  ID:       ${lead.id}`);
  console.log(`  Name:     ${lead.name}`);
  console.log(`  Phone:    ${lead.phone}`);
  console.log(`  Move:     ${lead.from_location} → ${lead.to_location}`);
  console.log(`  Size:     ${lead.bedrooms}`);
  console.log(`  Date:     ${lead.move_date}`);
  console.log(`  Company:  ${lead.company}`);
  console.log('─'.repeat(40) + '\n');
  return lead;
}

export function saveBooking(data) {
  const booking = {
    id: `BOOKING-${String(bookingCounter++).padStart(4, '0')}`,
    ...data,
    created_at: new Date().toISOString()
  };
  bookings.push(booking);
  console.log(`\n📅 CALLBACK SCHEDULED\n${'─'.repeat(40)}`);
  console.log(`  ID:       ${booking.id}`);
  console.log(`  Name:     ${booking.name}`);
  console.log(`  Phone:    ${booking.phone}`);
  console.log(`  Time:     ${booking.preferred_time}`);
  console.log(`  Company:  ${booking.company}`);
  console.log('─'.repeat(40) + '\n');
  return booking;
}

export function saveFlag(data) {
  const flag = {
    id: `URGENT-${String(flagCounter++).padStart(4, '0')}`,
    ...data,
    created_at: new Date().toISOString()
  };
  flags.push(flag);
  console.log(`\n🚨 HUMAN HANDOFF TRIGGERED\n${'─'.repeat(40)}`);
  console.log(`  ID:       ${flag.id}`);
  console.log(`  Reason:   ${flag.reason}`);
  console.log(`  Summary:  ${flag.summary}`);
  console.log(`  Company:  ${flag.company}`);
  console.log('─'.repeat(40) + '\n');
  return flag;
}

export function getAllData() {
  return {
    leads,
    bookings,
    flags,
    totals: { leads: leads.length, bookings: bookings.length, flags: flags.length }
  };
}
