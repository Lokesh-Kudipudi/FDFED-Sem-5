import React from 'react';

function ContactImage() {
  return (
    <div className="hidden md:block w-2/5 relative overflow-hidden">
      <img
        src="https://www.123rf.com/photo_21005238_ferns-and-trees-in-a-lush-forest-in-shenandoah-national-park-virginia.html"
        alt="Ferns and trees in Shenandoah National Park"
        className="w-full h-full object-cover"
        onError={(e) => {
          console.log("123rf image failed to load - using high-quality forest fallback");
          // Use a high-quality forest image as fallback
          e.target.src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80";
        }}
      />
    </div>
  );
}

export default ContactImage;
