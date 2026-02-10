import React from 'react';

function ContactImage() {
  return (
    <div className="hidden md:block w-2/5 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
        alt="Ferns and trees in Shenandoah National Park"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ContactImage;
