import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Virtual for full path (for nested categories)
categorySchema.virtual("path").get(async function () {
  if (!this.parent) return `/${this.slug}`;

  const parent = await mongoose.model("Category").findById(this.parent);
  if (!parent) return `/${this.slug}`;

  return `${parent.path}/${this.slug}`;
});

// Static method to get category tree
categorySchema.statics.getTree = async function () {
  const categories = await this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate("parent");

  const buildTree = (parentId = null, level = 1) => {
    return categories
      .filter((cat) => {
        const parentMatch = cat.parent
          ? cat.parent._id.toString() === parentId?.toString()
          : !parentId;
        return parentMatch && cat.level === level;
      })
      .map((cat) => ({
        ...cat.toObject(),
        children: buildTree(cat._id, level + 1),
      }));
  };

  return buildTree();
};

const Category = mongoose.model("Category", categorySchema);

export default Category;
