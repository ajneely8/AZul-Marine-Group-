/* ==================================================================
   Azul Marine Group media library.

   To add a video, add an object to AMG_MEDIA.videos. Supported types:

     type: "youtube"   src: the YouTube video ID or full URL
     type: "vimeo"     src: the Vimeo video ID or full URL
     type: "file"      src: path to an .mp4 file in assets/video/
     type: ""          (no video yet) shows a "Video Coming Soon" card

   Optional: poster (thumbnail image path), date (free text), event.

   Photos work the same way in AMG_MEDIA.photos. Every photo listed
   here was published by the organization on its Facebook page.
   ================================================================== */
window.AMG_MEDIA = {
  videos: [
    {
      title: "Joint agency training on the Delta",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    },
    {
      title: "Swiftwater and small-boat rescue operations",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    },
    {
      title: "Dive and salvage support",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    },
    {
      title: "Boating safety education",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    },
    {
      title: "Water quality and levee inspection work",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    },
    {
      title: "Organization overview",
      description: "Video to be provided by Azul Marine Group.",
      date: "Date to be confirmed",
      type: "",
      src: "",
      poster: ""
    }
  ],
  photos: [
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
