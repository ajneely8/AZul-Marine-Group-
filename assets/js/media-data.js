/* ==================================================================
   Azul Marine Group media library.

   To add a video, add an object to AMG_MEDIA.videos. Supported types:

     type: "youtube"   src: the YouTube video ID or full URL
     type: "vimeo"     src: the Vimeo video ID or full URL
     type: "file"      src: path to an .mp4 file in assets/video/
     type: ""          (no video yet) shows a "Video Coming Soon" card

   Optional: poster (thumbnail image path), date (free text), event,
   portrait: true (vertical phone video; opens in a tall player).

   Photos work the same way in AMG_MEDIA.photos. Every photo listed
   here was published by the organization on its Facebook page.
   ================================================================== */
window.AMG_MEDIA = {
  videos: [
    {
      title: "Open Water Large Vessel Training",
      description: "Pacific Coast Water Rescue trains with five agencies in a State Fire Training exercise hosted by the Woodbridge Fire Department.",
      date: "State Fire Training",
      event: "Video: Pacific Coast Water Rescue",
      type: "file",
      src: "assets/video/state-fire-training.mp4",
      poster: "assets/video/state-fire-training-poster.jpg"
    },
    {
      title: "Sea Horse 36 Delivery",
      description: "Running a one-of-a-kind steel-hulled motor sail vessel from J&H Marine in Stockton to the Oakland Estuary.",
      date: "May 2025",
      event: "Video: Pacific Coast Water Rescue",
      type: "file",
      src: "assets/video/sea-horse-36-delivery.mp4",
      poster: "assets/video/sea-horse-36-delivery-poster.jpg"
    },
    {
      title: "Training with Woodbridge Fire District",
      description: "On the water with Woodbridge Fire District to make the Delta a safer place.",
      date: "December 2023",
      event: "Video: Pacific Coast Water Rescue",
      type: "file",
      portrait: true,
      src: "assets/video/woodbridge-fire-training.mp4",
      poster: "assets/video/woodbridge-fire-training-poster.jpg"
    },
    {
      title: "Carquinez Strait Water Rescue Drill",
      description: "A State Fire class and drill for water rescue teams from the Benicia, Rio Vista, and Napa fire departments, on a vessel provided by Protector Service Center.",
      date: "November 21, 2020",
      event: "Video: Pacific Coast Water Rescue",
      type: "file",
      portrait: true,
      src: "assets/video/carquinez-strait-drill.mp4",
      poster: "assets/video/carquinez-strait-drill-poster.jpg"
    },
    {
      title: "Haulover Inlet",
      description: "Captains on Call observe one of the most challenging inlets for mariners, a well-known training example in Florida.",
      date: "April 2022",
      event: "Video: Pacific Coast Water Rescue",
      type: "file",
      portrait: true,
      src: "assets/video/haulover-inlet.mp4",
      poster: "assets/video/haulover-inlet-poster.jpg"
    }
  ],
  photos: [
    {
      src: "assets/img/seawolf-underway-1200.jpg",
      webp: "assets/img/seawolf-underway-1200.webp",
      alt: "Fireboat Sea Wolf underway past the Port of Oakland container cranes",
      caption: "Sea Wolf leaving Oakland for Stockton, July 27, 2026. Photo: Azul Marine Group."
    },
    {
      src: "assets/img/crew-antioch-1200.jpg",
      webp: "assets/img/crew-antioch-1200.webp",
      alt: "Four crew members standing on the bow of Sea Wolf as she passes under the Antioch Bridge",
      caption: "The transit crew on the bow under the Antioch Bridge. Photo: Azul Marine Group."
    },
    {
      src: "assets/img/helm-sendoff-portrait-1000.jpg",
      webp: "assets/img/helm-sendoff-portrait-1000.webp",
      alt: "View from the wheelhouse of Sea Wolf as a fireboat sprays arcs of water ahead during the send-off",
      caption: "From the helm: the fireboat send-off in the Oakland Estuary. Photo: Azul Marine Group."
    },
    {
      src: "assets/img/crew-wheelhouse-portrait-1000.jpg",
      webp: "assets/img/crew-wheelhouse-portrait-1000.webp",
      alt: "Three crew members in the wheelhouse of Sea Wolf seen through the forward window",
      caption: "In the wheelhouse during the transit. Photo: Azul Marine Group."
    },
    {
      src: "assets/img/bow-captain-portrait-1000.jpg",
      webp: "assets/img/bow-captain-portrait-1000.webp",
      alt: "A crew member in a life vest on the bow of Sea Wolf with the Bay behind",
      caption: "On the bow, crossing the Bay. Photo: Azul Marine Group."
    },
    {
      src: "assets/img/seawolf-dock-1200.jpg",
      webp: "assets/img/seawolf-dock-1200.webp",
      alt: "The retired City of Oakland fireboat Sea-Wolf, red hull and white wheelhouse, tied up at a dock",
      caption: "Fireboat Seawolf, acquired by Azul Marine Group for restoration. Photo: Azul Marine Group (Seawolf campaign)."
    },
    {
      src: "assets/img/seawolf-divers-1200.jpg",
      webp: "assets/img/seawolf-divers-1200.webp",
      alt: "Two members help a diver gear up on the stern of the fireboat Seawolf",
      caption: "Dive team working from the stern of Seawolf. Photo: Azul Marine Group (Seawolf campaign)."
    },
    {
      src: "assets/img/seawolf-hull-diver-1200.jpg",
      webp: "assets/img/seawolf-hull-diver-1200.webp",
      alt: "A diver in the water alongside the hull of the fireboat Seawolf",
      caption: "Hull inspection dive alongside Seawolf. Photo: Azul Marine Group (Seawolf campaign)."
    },
    {
      src: "assets/img/seawolf-wheelhouse-1200.jpg",
      webp: "assets/img/seawolf-wheelhouse-1200.webp",
      alt: "The wheelhouse of the fireboat Seawolf with helm, engine gauges, and radios",
      caption: "Seawolf's wheelhouse. Photo: Azul Marine Group (Seawolf campaign)."
    },
    {
      src: "assets/img/seawolf-pump-1200.jpg",
      webp: "assets/img/seawolf-pump-1200.webp",
      alt: "A fire pump casing lifted on a chain hoist with the impeller exposed",
      caption: "Fire pump work aboard Seawolf. Photo: Azul Marine Group (Seawolf campaign)."
    },
    {
      src: "assets/img/rescue-boat-crew-820.jpg",
      webp: "assets/img/rescue-boat-crew-820.webp",
      alt: "Crew members in helmets and float coats aboard a red and grey rescue boat on the Delta, with an inflatable boat alongside",
      caption: "Rescue boat and crew on the water. Photo: Azul Marine Group (Facebook)."
    },
    {
      src: "assets/img/delta-helicopter-1008.jpg",
      webp: "assets/img/delta-helicopter-1008.webp",
      alt: "A helicopter hovering low over a Delta waterway while a small boat and a personal watercraft operate below",
      caption: "Helicopter, small boat, and personal watercraft operating together on a Delta waterway. Photo: Azul Marine Group (Facebook)."
    }
  ]
};
