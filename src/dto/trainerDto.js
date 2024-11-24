class TrainerDTO {
  constructor(trainer) {
    this.id = trainer._id;
    this.email = trainer.email;
    this.name = trainer.name;
    this.phone = trainer.phone;
    this.photo = trainer.photo;
    this.role = trainer.role;
    this.educations = trainer.educations;
    this.experiences = trainer.experiences;
    this.services = trainer.services;
    this.bio = trainer.bio;
    this.about = trainer.about;
    this.specialization = trainer.specialization;
    this.isApproved = trainer.isApproved;
    this.cart = trainer.cart;
  }
}

module.exports = TrainerDTO;
