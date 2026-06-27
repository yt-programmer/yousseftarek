import { motion } from "framer-motion";
import WorksDash from "../components/Dashboard/WorksDash";
import TestimonialsDash from "../components/Dashboard/TestimonialsDash";

const DashboardPage = () => {
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>dashboard
          </h2>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-sm mt-5  font-semibold text-gray-400"
          >
            Manage your portfolio
          </motion.p>
        </div>

        <div className="flex flex-col gap-10">
          <WorksDash />
          <TestimonialsDash />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
